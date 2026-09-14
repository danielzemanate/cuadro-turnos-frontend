import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import {
  SESSION_AWAY_LOGOUT_MS,
  SESSION_IDLE_CHECK_MS,
  SESSION_STAY_MODAL_MS,
  SESSION_WARNING_MS,
} from "../constants/session.constants";
import {
  clearLastActivity,
  readLastActivity,
  writeLastActivity,
} from "../helpers/sessionActivity";
import { logoutUser } from "../redux/actions/userActions";
import {
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "../redux/actions/helpersActions";
import { AppState } from "../redux/reducers/rootReducer";
import { useAppDispatch, useAppDispatchThunk } from "./storeHooks";

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
];

export const useSessionTimeout = () => {
  const dispatch = useAppDispatch();
  const dispatchThunk = useAppDispatchThunk();
  const navigate = useNavigate();
  const isAuth = useSelector(
    (state: AppState) => !!state.user.userData?.access_token,
  );
  const lastActivityRef = useRef(Date.now());
  const lastPersistRef = useRef(0);
  const expiredRef = useRef(false);
  const warningOpenRef = useRef(false);
  const warningDeadlineRef = useRef<number | null>(null);

  const [warningOpen, setWarningOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const persistActivity = (timestamp: number, force = false) => {
    lastActivityRef.current = timestamp;
    if (!force && timestamp - lastPersistRef.current < 1000) return;
    lastPersistRef.current = timestamp;
    writeLastActivity(timestamp);
  };

  const expire = useCallback(() => {
    if (expiredRef.current) return;
    expiredRef.current = true;
    warningOpenRef.current = false;
    warningDeadlineRef.current = null;
    setWarningOpen(false);
    setSecondsLeft(0);
    clearLastActivity();
    dispatch(setOpenToast(true));
    dispatch(setVariantToast("warning"));
    dispatch(setMessageToast(t("alerts.sessionExpired")));
    dispatchThunk(logoutUser());
    navigate("/");
  }, [dispatch, dispatchThunk, navigate]);

  const stay = useCallback(() => {
    if (expiredRef.current) return;
    warningOpenRef.current = false;
    warningDeadlineRef.current = null;
    const now = Date.now();
    lastActivityRef.current = now;
    lastPersistRef.current = now;
    writeLastActivity(now);
    setWarningOpen(false);
    setSecondsLeft(0);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      expiredRef.current = false;
      warningOpenRef.current = false;
      warningDeadlineRef.current = null;
      lastActivityRef.current = Date.now();
      setWarningOpen(false);
      setSecondsLeft(0);
      clearLastActivity();
      return;
    }

    expiredRef.current = false;
    const stored = readLastActivity();
    const now = Date.now();
    lastActivityRef.current = stored ?? now;
    if (!stored) writeLastActivity(now);

    // Pestaña cerrada o recarga: logout si ya pasó el tiempo de ausencia
    if (now - lastActivityRef.current >= SESSION_AWAY_LOGOUT_MS) {
      expire();
      return;
    }

    const markActivity = () => {
      if (warningOpenRef.current || expiredRef.current) return;
      persistActivity(Date.now());
    };

    const checkIdle = () => {
      if (expiredRef.current) return;

      if (warningOpenRef.current) {
        const deadline = warningDeadlineRef.current ?? Date.now();
        const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setSecondsLeft(left);
        if (left <= 0) expire();
        return;
      }

      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= SESSION_STAY_MODAL_MS + SESSION_WARNING_MS) {
        expire();
        return;
      }

      if (idleMs >= SESSION_STAY_MODAL_MS) {
        warningOpenRef.current = true;
        warningDeadlineRef.current = Date.now() + SESSION_WARNING_MS;
        setWarningOpen(true);
        setSecondsLeft(Math.ceil(SESSION_WARNING_MS / 1000));
      }
    };

    const persistOnLeave = () => {
      writeLastActivity(lastActivityRef.current);
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, markActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", checkIdle);
    window.addEventListener("pageshow", checkIdle);
    window.addEventListener("beforeunload", persistOnLeave);
    const intervalId = window.setInterval(checkIdle, SESSION_IDLE_CHECK_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, markActivity),
      );
      document.removeEventListener("visibilitychange", checkIdle);
      window.removeEventListener("pageshow", checkIdle);
      window.removeEventListener("beforeunload", persistOnLeave);
      window.clearInterval(intervalId);
    };
  }, [isAuth, expire]);

  return {
    warningOpen,
    secondsLeft,
    stay,
    leave: expire,
  };
};
