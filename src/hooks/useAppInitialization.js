import { useRef, useEffect, useCallback } from 'react';
import { DataManager } from '../data/DataManager';
import { seedMockDB } from '../data/seedMockData';

const VAPID_PUBLIC_KEY = 'BCfx_b-KMT2vzftgdcPRiXJLz4tGANrj-iz39RYaUVRIQdaN7DYK-Hz_bDHdkEJYEYJkZlpDDzT-whymv0TyvvI';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useAppInitialization = (session, nextWeek, prevWeek) => {
    const touchStart = useRef(null);
    const touchEnd = useRef(null);
    const minSwipeDistance = 50;

    // 1. Theme, Push, and Mock Data Setup
    useEffect(() => {
        // Seed Mock Data if offline mode
        if (localStorage.getItem('mp_use_mock_db') === 'true') {
            seedMockDB();
        }

        if (!session?.user?.id) return;

        // Load Theme
        DataManager.getProfile(session.user.id).then(p => {
            if (p?.theme_preference) {
                document.documentElement.setAttribute('data-theme', p.theme_preference);
            }
        });

        // Push Notifications
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(async (registration) => {
                try {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                    });
                    
                    localStorage.setItem('current_push_endpoint', subscription.endpoint);
                    await DataManager.savePushSubscription(session.user.id, subscription);
                } catch (error) {
                    console.error("Push Subscription Error:", error);
                }
            });
        }
    }, [session]);

    // 2. Swipe Logic
    const onTouchStart = useCallback((e) => {
        touchEnd.current = null; 
        touchStart.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchMove = useCallback((e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            nextWeek();
        } else if (isRightSwipe) {
            prevWeek();
        }
    }, [nextWeek, prevWeek]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
