"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Palette,
  Key,
  Save,
  Plug,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Plug },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Settings" subtitle="Workspace / Settings" />

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <aside className="w-56 shrink-0 space-y-1 border-r border-zinc-800/60 bg-surface-1 p-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  activeTab === tab.id
                    ? "bg-surface-3 font-medium text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Settings content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">General Settings</h2>

              <div className="space-y-4 rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="iKame Global"
                    className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 px-3 text-sm text-zinc-200 focus:border-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Default Export Format</label>
                  <select className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 px-3 text-sm text-zinc-200 focus:border-primary/40 focus:outline-none">
                    <option>HTML5 (Single file)</option>
                    <option>ZIP Bundle</option>
                    <option>MRAID Wrapper</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Max File Size (MB)</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="h-9 w-full rounded-lg border border-zinc-800/60 bg-surface-1 px-3 text-sm text-zinc-200 focus:border-primary/40 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Auto-save drafts</p>
                    <p className="text-xs text-zinc-500">Save drafts every 30 seconds</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition" role="switch" aria-checked="true">
                    <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition" />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">AI auto-optimization</p>
                    <p className="text-xs text-zinc-500">Automatically apply AI suggestions on new variants</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-primary transition" role="switch" aria-checked="true">
                    <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition" />
                  </button>
                </div>
              </div>

              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </motion.div>
          )}

          {activeTab === "api-keys" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl space-y-6"
            >
              <h2 className="text-lg font-semibold text-zinc-100">API Keys</h2>

              <div className="space-y-3 rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
                {[
                  { name: "OpenAI API Key", key: "sk-...7x3f", status: "active" },
                  { name: "AppLovin API Key", key: "al-...9k2m", status: "active" },
                  { name: "Unity Ads Token", key: "ua-...4h8p", status: "active" },
                  { name: "Mintegral API Key", key: "mt-...1j5n", status: "expired" },
                ].map((apiKey) => (
                  <div
                    key={apiKey.name}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{apiKey.name}</p>
                        <p className="font-mono text-[11px] text-zinc-500">{apiKey.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          apiKey.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {apiKey.status}
                      </span>
                      <button className="rounded-lg border border-zinc-800/60 px-2.5 py-1.5 text-xs text-zinc-400 transition hover:text-zinc-200">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 rounded-lg bg-surface-3 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:text-zinc-100">
                <Key className="h-4 w-4" />
                + Add API Key
              </button>
            </motion.div>
          )}

          {activeTab !== "general" && activeTab !== "api-keys" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Settings className="mb-3 h-10 w-10 text-zinc-600" />
              <p className="text-sm text-zinc-400">
                {tabs.find((t) => t.id === activeTab)?.label} settings
              </p>
              <p className="text-xs text-zinc-600">Coming soon</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
