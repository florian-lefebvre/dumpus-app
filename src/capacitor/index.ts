"use client";

import type { SafeAreaInsets } from "capacitor-plugin-safe-area";
import { colors } from "../../tailwind.config";

export async function initCapacitor() {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV !== "mobile") return;
  if (typeof document === "undefined") return;

  const { App } = await import("@capacitor/app");
  const { StatusBar, Style } = await import("@capacitor/status-bar");
  const { NavigationBar } = await import(
    "@hugotomazi/capacitor-navigation-bar"
  );
  const { SafeArea } = await import("capacitor-plugin-safe-area");

  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  await StatusBar.setOverlaysWebView({ overlay: true });
  await StatusBar.setStyle({ style: Style.Dark });
  await NavigationBar.setTransparency({ isTransparent: true });

  // const color = colors.gray[950];
  // await StatusBar.setBackgroundColor({ color });
  // await NavigationBar.setColor({ color });

  function handleInsets(insets: SafeAreaInsets["insets"]) {
    for (const [key, value] of Object.entries(insets)) {
      document.documentElement.style.setProperty(
        `--safe-area-${key}`,
        `${value}px`
      );
    }
  }

  handleInsets((await SafeArea.getSafeAreaInsets()).insets);
  await SafeArea.addListener("safeAreaChanged", ({ insets }) =>
    handleInsets(insets)
  );
}

initCapacitor();
