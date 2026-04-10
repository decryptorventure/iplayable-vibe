"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  X,
  Eye,
  Edit3,
  Rocket,
  Crown,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Editor" | "Viewer";
  lastActive: string;
  joinedAt: string;
  projects: number;
}

const initialMembers: TeamMember[] = [
  { id: "m1", name: "Dung Nguyen Viet", email: "dungxv@ikameglobal.com", avatar: "DV", role: "Admin", lastActive: "Online", joinedAt: "Jan 2025", projects: 12 },
  { id: "m2", name: "Chung Quang Trung", email: "chungqt@ikameglobal.com", avatar: "CT", role: "Editor", lastActive: "2 giờ trước", joinedAt: "Mar 2025", projects: 8 },
  { id: "m3", name: "Binh Hoang Truong", email: "binhht@ikameglobal.com", avatar: "BT", role: "Editor", lastActive: "1 ngày trước", joinedAt: "Feb 2025", projects: 5 },
  { id: "m4", name: "Thanh Nguyen Van", email: "thannv@ikameglobal.com", avatar: "TN", role: "Viewer", lastActive: "3 ngày trước", joinedAt: "Jun 2025", projects: 3 },
  { id: "m5", name: "Linh Pham Thi", email: "linhpt@ikameglobal.com", avatar: "LP", role: "Viewer", lastActive: "1 tuần trước", joinedAt: "Aug 2025", projects: 2 },
];

const activityLog = [
  { user: "Dung Nguyen Viet", action: "deployed 260402 B2WL PAIH WoolLoop to AppLovin", time: "2 phút trước" },
  { user: "Chung Quang Trung", action: "created A/B test: CTA Color Test", time: "1 giờ trước" },
  { user: "Binh Hoang Truong", action: "edited variant B2WL_PAIH_WoolLoop lv22", time: "3 giờ trước" },
  { user: "Dung Nguyen Viet", action: "added automation rule: Pause CTR < 2%", time: "5 giờ trước" },
  { user: "Chung Quang Trung", action: "generated 50 variants for Pub Thief Hunter", time: "1 ngày trước" },
  { user: "Thanh Nguyen Van", action: "viewed Analytics report W14 2026", time: "2 ngày trước" },
];

const roleColors = {
  Admin: "bg-primary/10 text-primary",
  Editor: "bg-info/10 text-info",
  Viewer: "bg-zinc-800 text-zinc-400",
};

const roleIcons = { Admin: Crown, Editor: Edit3, Viewer: Eye };

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Editor" | "Viewer">("Editor");
  const [invited, setInvited] = useState(false);

  const sendInvite = () => {
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      role: inviteRole,
      lastActive: "Pending invite",
      joinedAt: "—",
      projects: 0,
    };
    setMembers((prev) => [...prev, newMember]);
    setInvited(true);
  };

  const resetInvite = () => {
    setShowInvite(false);
    setInvited(false);
    setInviteEmail("");
    setInviteRole("Editor");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Team" subtitle="Settings / Team Management" />

      <div className="flex-1 space-y-6 overflow-auto p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Team Members", value: members.length.toString(), icon: Users, color: "text-primary" },
            { label: "Admins", value: members.filter((m) => m.role === "Admin").length.toString(), icon: Crown, color: "text-warning" },
            { label: "Editors", value: members.filter((m) => m.role === "Editor").length.toString(), icon: Edit3, color: "text-info" },
            { label: "Viewers", value: members.filter((m) => m.role === "Viewer").length.toString(), icon: Eye, color: "text-zinc-400" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-zinc-800/60 bg-surface-2 p-4">
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
              <p className="text-[11px] text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Members list */}
        <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">👥 Members</h3>
            <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark">
              <UserPlus className="h-3.5 w-3.5" /> Invite Member
            </button>
          </div>

          <div className="space-y-2">
            {members.map((member, i) => {
              const RoleIcon = roleIcons[member.role];
              return (
                <motion.div key={member.id}
                  initial={i >= initialMembers.length ? { opacity: 0, y: -8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-surface-1 px-4 py-3 transition hover:border-zinc-700/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary-light/60 text-xs font-bold text-white">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{member.name}</p>
                      <p className="text-[11px] text-zinc-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-[11px] text-zinc-400">{member.projects} projects</p>
                      <p className={`text-[10px] ${member.lastActive === "Online" ? "text-success" : "text-zinc-500"}`}>
                        {member.lastActive === "Online" && "● "}{member.lastActive}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${roleColors[member.role]}`}>
                      <RoleIcon className="h-3 w-3" /> {member.role}
                    </span>
                    <button className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Permissions */}
        <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
          <h3 className="mb-4 text-sm font-semibold text-zinc-200">🔐 Role Permissions</h3>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800/40">
                  <th className="pb-2 text-left font-medium text-zinc-400">Permission</th>
                  <th className="pb-2 text-center font-medium text-warning">Admin</th>
                  <th className="pb-2 text-center font-medium text-info">Editor</th>
                  <th className="pb-2 text-center font-medium text-zinc-400">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { perm: "View dashboard & analytics", admin: true, editor: true, viewer: true },
                  { perm: "Edit playable ad configs", admin: true, editor: true, viewer: false },
                  { perm: "Generate AI variants", admin: true, editor: true, viewer: false },
                  { perm: "Deploy to ad networks", admin: true, editor: false, viewer: false },
                  { perm: "Manage A/B tests", admin: true, editor: true, viewer: false },
                  { perm: "Create automation rules", admin: true, editor: false, viewer: false },
                  { perm: "Invite/remove team members", admin: true, editor: false, viewer: false },
                  { perm: "Manage API keys & settings", admin: true, editor: false, viewer: false },
                ].map((row) => (
                  <tr key={row.perm} className="border-b border-zinc-800/20">
                    <td className="py-2.5 text-zinc-300">{row.perm}</td>
                    <td className="py-2.5 text-center">{row.admin ? <CheckCircle2 className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-zinc-700" />}</td>
                    <td className="py-2.5 text-center">{row.editor ? <CheckCircle2 className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-zinc-700" />}</td>
                    <td className="py-2.5 text-center">{row.viewer ? <CheckCircle2 className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-zinc-700" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="rounded-xl border border-zinc-800/60 bg-surface-2 p-5">
          <h3 className="mb-4 text-sm font-semibold text-zinc-200">📋 Recent Activity</h3>
          <div className="space-y-2">
            {activityLog.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800/20 bg-surface-1 px-4 py-2.5">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-300">
                    <span className="font-medium text-zinc-200">{item.user}</span> {item.action}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-600">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={resetInvite}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-surface-1 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800/40 px-6 py-4">
                <h3 className="text-sm font-semibold text-zinc-100">Invite Team Member</h3>
                <button onClick={resetInvite} className="text-zinc-400 hover:text-zinc-200"><X className="h-4 w-4" /></button>
              </div>
              {!invited ? (
                <div className="space-y-4 px-6 py-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
                    <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-surface-2 px-3">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="name@ikameglobal.com"
                        className="h-9 flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Role</label>
                    <div className="flex gap-2">
                      {(["Editor", "Viewer"] as const).map((r) => (
                        <button key={r} onClick={() => setInviteRole(r)}
                          className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition ${
                            inviteRole === r ? "border-primary bg-primary/10 text-primary" : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-success" />
                  </motion.div>
                  <h4 className="mb-1 text-sm font-bold text-zinc-100">Invitation Sent! ✉️</h4>
                  <p className="text-xs text-zinc-400">{inviteEmail} sẽ nhận email mời tham gia.</p>
                </div>
              )}
              <div className="flex justify-end border-t border-zinc-800/40 px-6 py-4">
                {!invited ? (
                  <div className="flex gap-2">
                    <button onClick={resetInvite} className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400">Cancel</button>
                    <button onClick={sendInvite} disabled={!inviteEmail} className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-white disabled:opacity-40">
                      Send Invite
                    </button>
                  </div>
                ) : (
                  <button onClick={resetInvite} className="rounded-lg bg-primary px-5 py-2 text-xs font-medium text-white">Done</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
