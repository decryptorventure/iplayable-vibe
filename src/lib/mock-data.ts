import type { Project } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "proj-water-factory",
    name: "iG Water Factory",
    slug: "ig-water-factory",
    status: "Active",
    totalVariants: 148,
    avgCTR: 4.2,
    avgCVR: 1.73,
    totalSpend: 62340
  },
  {
    id: "proj-sticker-out",
    name: "iG Sticker Out",
    slug: "ig-sticker-out",
    status: "AI Syncing",
    totalVariants: 96,
    avgCTR: 3.6,
    avgCVR: 1.33,
    totalSpend: 50120
  },
  {
    id: "proj-monster-merge",
    name: "iG Monster Merge",
    slug: "ig-monster-merge",
    status: "Active",
    totalVariants: 82,
    avgCTR: 5.1,
    avgCVR: 1.91,
    totalSpend: 41200
  },
  {
    id: "proj-bubble-quest",
    name: "iG Bubble Quest",
    slug: "ig-bubble-quest",
    status: "Paused",
    totalVariants: 44,
    avgCTR: 2.7,
    avgCVR: 1.1,
    totalSpend: 28450
  }
];

export type PlayableAdStatus = "active" | "inactive" | "draft";

export interface PlayableAd {
  id: string;
  name: string;
  code: string;
  projectId: string;
  projectName: string;
  status: PlayableAdStatus;
  variantCount: number;
  networks: string[];
  thumbnail?: string | null;
  createdBy: string;
  lastModified: string;
  fileSize: number;
  ctr?: number;
  cvr?: number;
}

export const mockPlayableAds: PlayableAd[] = [
  { id: "pa-1", name: "B2 Wool Loop", code: "B2WL", projectId: "proj-water-factory", projectName: "B2 Wool Loop", status: "active", variantCount: 3, networks: ["AppLovin", "Unity"], createdBy: "chungqt@ikameglobal.com", lastModified: "08/04/26 18:21", fileSize: 4300, ctr: 4.2, cvr: 1.8 },
  { id: "pa-2", name: "B2 Word Jam", code: "B2WJ", projectId: "proj-water-factory", projectName: "B2 Word Jam", status: "active", variantCount: 4, networks: ["Mintegral"], createdBy: "chungqt@ikameglobal.com", lastModified: "08/04/26 17:45", fileSize: 3800, ctr: 3.6, cvr: 1.5 },
  { id: "pa-3", name: "iG Sticker Out", code: "IGSO", projectId: "proj-sticker-out", projectName: "iG Sticker Out", status: "active", variantCount: 4, networks: ["AppLovin", "Mintegral"], createdBy: "binhht@ikameglobal.com", lastModified: "07/04/26 22:10", fileSize: 5200, ctr: 5.1, cvr: 2.0 },
  { id: "pa-4", name: "Majong Jam", code: "IGMJ", projectId: "proj-monster-merge", projectName: "Majong Jam", status: "active", variantCount: 4, networks: ["Unity"], createdBy: "chungqt@ikameglobal.com", lastModified: "07/04/26 20:30", fileSize: 4100, ctr: 3.9, cvr: 1.6 },
  { id: "pa-5", name: "Pixel Blast", code: "B2PB", projectId: "proj-water-factory", projectName: "Pixel Blast", status: "active", variantCount: 5, networks: ["AppLovin"], createdBy: "dungxv@ikameglobal.com", lastModified: "06/04/26 15:12", fileSize: 3500, ctr: 4.8, cvr: 1.9 },
  { id: "pa-6", name: "Ptit Merge Fruit", code: "IGMF", projectId: "proj-monster-merge", projectName: "Ptit Merge Fruit", status: "active", variantCount: 6, networks: ["Mintegral", "Unity"], createdBy: "thannv@ikameglobal.com", lastModified: "06/04/26 14:00", fileSize: 4800, ctr: 3.2, cvr: 1.3 },
  { id: "pa-7", name: "Pub Dream Room", code: "GPDR", projectId: "proj-bubble-quest", projectName: "Pub Dream Room", status: "active", variantCount: 3, networks: ["AppLovin"], createdBy: "binhht@ikameglobal.com", lastModified: "05/04/26 19:45", fileSize: 5500, ctr: 4.5, cvr: 1.7 },
  { id: "pa-8", name: "Pub Thief Hunter", code: "p1H", projectId: "proj-bubble-quest", projectName: "Pub Thief Hunter", status: "active", variantCount: 5, networks: ["Unity", "Mintegral"], createdBy: "chungqt@ikameglobal.com", lastModified: "05/04/26 16:30", fileSize: 4600, ctr: 5.3, cvr: 2.1 },
  { id: "pa-9", name: "Pub Tidy Up", code: "IGTU", projectId: "proj-sticker-out", projectName: "Pub Tidy Up", status: "active", variantCount: 2, networks: ["AppLovin"], createdBy: "dungxv@ikameglobal.com", lastModified: "04/04/26 11:20", fileSize: 3200, ctr: 3.0, cvr: 1.2 },
  { id: "pa-10", name: "iG Block Buster", code: "IGBB", projectId: "proj-water-factory", projectName: "iG Block Buster", status: "active", variantCount: 4, networks: ["Mintegral"], createdBy: "thannv@ikameglobal.com", lastModified: "04/04/26 10:00", fileSize: 4200, ctr: 4.1, cvr: 1.5 },
  { id: "pa-11", name: "iG Block Escape 3D", code: "IGBE", projectId: "proj-monster-merge", projectName: "iG Block Escape 3D", status: "inactive", variantCount: 1, networks: [], createdBy: "binhht@ikameglobal.com", lastModified: "03/04/26 22:00", fileSize: 6100, ctr: 2.1, cvr: 0.8 },
  { id: "pa-12", name: "iG Bus Out", code: "IGBO", projectId: "proj-sticker-out", projectName: "iG Bus Out", status: "active", variantCount: 1, networks: ["AppLovin"], createdBy: "chungqt@ikameglobal.com", lastModified: "03/04/26 18:15", fileSize: 3900, ctr: 3.7, cvr: 1.4 },
  { id: "pa-13", name: "iG Coffee Rush", code: "IGCR", projectId: "proj-water-factory", projectName: "iG Coffee Rush", status: "active", variantCount: 5, networks: ["Unity"], createdBy: "dungxv@ikameglobal.com", lastModified: "02/04/26 16:00", fileSize: 4500, ctr: 4.6, cvr: 1.8 },
  { id: "pa-14", name: "iG Color Bus Flow", code: "IGCF", projectId: "proj-monster-merge", projectName: "iG Color Bus Flow", status: "active", variantCount: 4, networks: ["Mintegral", "AppLovin"], createdBy: "thannv@ikameglobal.com", lastModified: "02/04/26 14:30", fileSize: 5000, ctr: 3.4, cvr: 1.3 },
  { id: "pa-15", name: "iG Color Yarn 3D", code: "IGCU", projectId: "proj-bubble-quest", projectName: "iG Color Yarn 3D", status: "active", variantCount: 5, networks: ["Unity"], createdBy: "binhht@ikameglobal.com", lastModified: "01/04/26 20:00", fileSize: 4700, ctr: 5.0, cvr: 2.0 },
  { id: "pa-16", name: "iG ColorMood", code: "IGCM", projectId: "proj-sticker-out", projectName: "iG ColorMood", status: "active", variantCount: 5, networks: ["AppLovin", "Mintegral"], createdBy: "chungqt@ikameglobal.com", lastModified: "01/04/26 15:45", fileSize: 3600, ctr: 4.3, cvr: 1.7 },
  { id: "pa-17", name: "iG Dragon Shooter", code: "IGDS", projectId: "proj-water-factory", projectName: "iG Dragon Shooter", status: "draft", variantCount: 0, networks: [], createdBy: "dungxv@ikameglobal.com", lastModified: "01/04/26 10:00", fileSize: 2800 },
  { id: "pa-18", name: "iG Drop In", code: "IGDI", projectId: "proj-monster-merge", projectName: "iG Drop In", status: "active", variantCount: 3, networks: ["Unity"], createdBy: "thannv@ikameglobal.com", lastModified: "31/03/26 18:30", fileSize: 4000, ctr: 3.8, cvr: 1.5 },
  { id: "pa-19", name: "iG Gecko Arrow", code: "IGGA", projectId: "proj-bubble-quest", projectName: "iG Gecko Arrow", status: "active", variantCount: 2, networks: ["Mintegral"], createdBy: "binhht@ikameglobal.com", lastModified: "31/03/26 14:20", fileSize: 3700, ctr: 3.5, cvr: 1.4 },
  { id: "pa-20", name: "iG Goods Jam", code: "IGGJ", projectId: "proj-sticker-out", projectName: "iG Goods Jam", status: "active", variantCount: 4, networks: ["AppLovin"], createdBy: "chungqt@ikameglobal.com", lastModified: "30/03/26 22:10", fileSize: 4400, ctr: 4.0, cvr: 1.6 },
];
