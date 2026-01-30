// WG Sphere Grid Generator (Figma Dev Plugin)
// FF10 スフィア盤スタイルの企業成長可視化プラグイン
// Version: 1.0.0 - FF10風再設計版

// ============================================================
// 型定義
// ============================================================

// ノード状態（既存4状態を維持）
type NodeState = "LOCKED" | "ELIGIBLE" | "UNLOCKED" | "MASTERED";

// ノードドメイン（FF10のキャラクター領域に相当）
type NodeDomain =
  | "CORE"      // 中央核
  | "PEOPLE"    // 採用・人材
  | "INFRA"     // 設備・インフラ
  | "PROCESS"   // 制度・プロセス
  | "QUALITY"   // 品質・セキュリティ
  | "BUSINESS"; // 新規事業

// ノード重要度（サイズに影響）
type NodeImportance = "MAJOR" | "STANDARD" | "MINOR";

// ノード形状
type NodeShape = "CIRCLE" | "HEXAGON" | "DIAMOND" | "OCTAGON";

// パスタイプ
type PathType = "MAIN" | "OPTIONAL" | "BLOCKED" | "CROSS_DOMAIN";

// カーブタイプ
type CurveType = "STRAIGHT" | "BEZIER";

// リング設定
interface RingConfig {
  id: string;
  label: string;
  labelEn: string;
  radius: number;
  glowIntensity: number;
  revenueThreshold: number;
}

// スフィア（リソース/条件）タイプ
type SphereType = "人材" | "資金" | "実績" | "時間" | "信頼" | "技術";

// 必要スフィア
interface RequiredSphere {
  type: SphereType;
  count: number;
}

// ノード設定（拡張版）
interface NodeConfig {
  id: string;
  label: string;
  ring: string;
  angleDeg: number;
  state: NodeState;
  domain: NodeDomain;
  importance: NodeImportance;
  shape: NodeShape;
  description?: string;
  sizeMultiplier?: number;
  requirements?: RequiredSphere[];
  effect?: string;
}

// エッジ設定（拡張版）
interface EdgeConfig {
  from: string;
  to: string;
  pathType: PathType;
  curveType?: CurveType;
  curveIntensity?: number;
}

// ドメイン設定
interface DomainConfig {
  id: NodeDomain;
  label: string;
  labelEn: string;
  color: RGB;
  accentColor: RGB;
  startAngle: number;
  endAngle: number;
}

// 状態パレット
interface StatePalette {
  fill: RGB;
  stroke: RGB;
  ring: RGB;
  text: RGB;
  effects: Effect[];
  glowColor: RGB;
  strokeWeight: number;
}

// バリアントセット
interface VariantSet {
  componentSet: ComponentSetNode;
  byKey: Map<string, ComponentNode>;
  containerFrame: FrameNode;
}

// 凡例アイテム
interface LegendItem {
  state: NodeState;
  label: string;
  labelEn: string;
  description: string;
}

// ============================================================
// 設定 (CONFIG)
// ============================================================

const CONFIG = {
  // フレーム設定
  FRAME: {
    name: "WG Sphere Grid",
    componentFrameName: "__WG_SphereComponents",
    width: 1920,
    height: 1080,
  },

  // ノード設定
  NODE: {
    sizes: {
      MAJOR: 110,
      STANDARD: 92,
      MINOR: 70,
    },
    strokeWeight: 3,
    innerRingOffset: 8,
  },

  // パス設定
  PATH: {
    types: {
      MAIN: { strokeWeight: 4, opacity: 0.85, glowRadius: 8, glowOpacity: 0.3 },
      OPTIONAL: { strokeWeight: 2, opacity: 0.6, glowRadius: 4, glowOpacity: 0.15 },
      BLOCKED: { strokeWeight: 2, opacity: 0.35, glowRadius: 2, glowOpacity: 0.1, dashPattern: [8, 4] },
      CROSS_DOMAIN: { strokeWeight: 2.5, opacity: 0.5, glowRadius: 6, glowOpacity: 0.2 },
    },
    defaultCurveIntensity: 0.15,
  },

  // リング設定
  RINGS: [
    { id: "R30", label: "年商 3,000万", labelEn: "¥30M", radius: 220, glowIntensity: 1.0, revenueThreshold: 30000000 },
    { id: "R60", label: "年商 6,000万", labelEn: "¥60M", radius: 360, glowIntensity: 0.7, revenueThreshold: 60000000 },
    { id: "R100", label: "年商 1億", labelEn: "¥100M", radius: 500, glowIntensity: 0.5, revenueThreshold: 100000000 },
  ] as RingConfig[],

  // ドメイン設定（FF10のキャラクター領域に相当）
  DOMAINS: [
    { id: "PEOPLE", label: "採用・人材", labelEn: "People", color: { r: 0.2, g: 0.6, b: 0.9 }, accentColor: { r: 0.3, g: 0.7, b: 1.0 }, startAngle: -90, endAngle: -18 },
    { id: "INFRA", label: "設備", labelEn: "Infra", color: { r: 0.9, g: 0.5, b: 0.2 }, accentColor: { r: 1.0, g: 0.6, b: 0.3 }, startAngle: -18, endAngle: 54 },
    { id: "PROCESS", label: "制度", labelEn: "Process", color: { r: 0.6, g: 0.4, b: 0.8 }, accentColor: { r: 0.7, g: 0.5, b: 0.9 }, startAngle: 54, endAngle: 126 },
    { id: "QUALITY", label: "品質", labelEn: "Quality", color: { r: 0.3, g: 0.8, b: 0.5 }, accentColor: { r: 0.4, g: 0.9, b: 0.6 }, startAngle: 126, endAngle: 198 },
    { id: "BUSINESS", label: "新規事業", labelEn: "Business", color: { r: 0.9, g: 0.3, b: 0.4 }, accentColor: { r: 1.0, g: 0.4, b: 0.5 }, startAngle: 198, endAngle: 270 },
    { id: "CORE", label: "CORE", labelEn: "Core", color: { r: 1.0, g: 0.84, b: 0 }, accentColor: { r: 1.0, g: 0.92, b: 0.5 }, startAngle: 0, endAngle: 360 },
  ] as DomainConfig[],

  // カラーパレット（FF10風強化版）
  COLORS: {
    bg: {
      deep: { r: 0.02, g: 0.03, b: 0.08 },
      mid: { r: 0.04, g: 0.06, b: 0.14 },
      glow: { r: 0.08, g: 0.14, b: 0.26 },
    },
    accent: {
      gold: { r: 1.0, g: 0.84, b: 0.0 },
      goldBright: { r: 1.0, g: 0.92, b: 0.5 },
      goldDim: { r: 0.72, g: 0.53, b: 0.04 },
    },
    state: {
      locked: { r: 0.25, g: 0.28, b: 0.35 },
      lockedDim: { r: 0.15, g: 0.17, b: 0.22 },
      eligible: { r: 1.0, g: 0.84, b: 0.0 },
      unlocked: { r: 0.2, g: 0.9, b: 0.5 },
      unlockedDim: { r: 0.1, g: 0.6, b: 0.4 },
      mastered: { r: 1.0, g: 0.95, b: 0.7 },
    },
    ui: {
      surface: { r: 1.0, g: 1.0, b: 1.0 },
      surfaceDim: { r: 0.7, g: 0.75, b: 0.8 },
      muted: { r: 0.29, g: 0.33, b: 0.41 },
      ring: { r: 0.29, g: 0.48, b: 0.72 },
      connector: { r: 0.23, g: 0.38, b: 0.56 },
    },
    stars: {
      bright: { r: 1.0, g: 1.0, b: 1.0 },
      dim: { r: 0.6, g: 0.7, b: 0.9 },
      blue: { r: 0.5, g: 0.6, b: 1.0 },
    },
  },

  // 背景設定
  BACKGROUND: {
    vignette: { enabled: true, intensity: 0.6, radiusRatio: 0.85 },
    centerGlow: { enabled: true, radius: 700, opacity: 0.4, blurRadius: 250 },
    starField: {
      enabled: true,
      layers: [
        { count: 80, sizeRange: [1, 2], opacityRange: [0.2, 0.5] },
        { count: 40, sizeRange: [2, 3], opacityRange: [0.4, 0.7] },
        { count: 15, sizeRange: [3, 5], opacityRange: [0.6, 0.9] },
      ],
      avoidRadius: 180,
    },
  },

  // ゲート条件テキスト
  GATES_TEXT: {
    title: "基盤ゲート達成条件",
    conditions: [
      "現預金：固定費4ヶ月分以上",
      "粗利率：40%以上",
      "稼働率：100%",
      "採用：契約済みBacklogのみ",
      "オフィス：賃料 ≤ 粗利15%",
    ],
  },

  // スフィアタイプ設定
  SPHERE_TYPES: [
    { type: "人材", description: "採用・育成リソース", color: { r: 0.2, g: 0.6, b: 0.9 } },
    { type: "資金", description: "財務・投資リソース", color: { r: 0.9, g: 0.7, b: 0.2 } },
    { type: "実績", description: "成功体験・ノウハウ", color: { r: 0.3, g: 0.8, b: 0.5 } },
    { type: "時間", description: "継続的な取り組み", color: { r: 0.6, g: 0.4, b: 0.8 } },
    { type: "信頼", description: "社内外の信頼関係", color: { r: 0.9, g: 0.5, b: 0.3 } },
    { type: "技術", description: "技術力・専門性", color: { r: 0.4, g: 0.7, b: 0.9 } },
  ],

  // 凡例設定
  LEGEND: {
    position: { x: 1520, y: 40 },
    size: { width: 360, height: 560 },
    items: [
      { state: "MASTERED", label: "定着", labelEn: "Mastered", description: "習得完了・定着済み" },
      { state: "UNLOCKED", label: "解放済", labelEn: "Unlocked", description: "習得中・実施中" },
      { state: "ELIGIBLE", label: "解放可", labelEn: "Eligible", description: "条件クリア・解放可能" },
      { state: "LOCKED", label: "未解放", labelEn: "Locked", description: "条件未達成" },
    ] as LegendItem[],
  },

  // ノードデータ（拡張版）
  NODES: [
    // CORE
    {
      id: "CORE", label: "WG\nCORE", ring: "CORE", angleDeg: 0, state: "MASTERED",
      domain: "CORE", importance: "MAJOR", shape: "OCTAGON", sizeMultiplier: 1.3,
      description: "企業の核心・全ての起点",
      effect: "全ノードへのアクセス解放",
      requirements: []
    },

    // R30 Ring
    {
      id: "HIRE_3", label: "採用\n〜3名", ring: "R30", angleDeg: -45, state: "ELIGIBLE",
      domain: "PEOPLE", importance: "STANDARD", shape: "CIRCLE",
      description: "最初の正社員採用",
      effect: "キャパシティ+30%",
      requirements: [{ type: "資金", count: 2 }, { type: "実績", count: 1 }]
    },
    {
      id: "OFFICE_15", label: "オフィス\n賃料≤15%", ring: "R30", angleDeg: 15, state: "ELIGIBLE",
      domain: "INFRA", importance: "STANDARD", shape: "DIAMOND",
      description: "適正なオフィスコスト",
      effect: "固定費最適化",
      requirements: [{ type: "資金", count: 1 }]
    },
    {
      id: "PRODUCTIZE", label: "型化\n研修商品", ring: "R30", angleDeg: 75, state: "ELIGIBLE",
      domain: "PROCESS", importance: "MAJOR", shape: "HEXAGON", sizeMultiplier: 1.15,
      description: "サービスの標準化・商品化",
      effect: "再現性+50%, スケーラビリティ確保",
      requirements: [{ type: "技術", count: 2 }, { type: "時間", count: 1 }]
    },
    {
      id: "BACKOFFICE", label: "バック\nオフィス", ring: "R30", angleDeg: 150, state: "ELIGIBLE",
      domain: "PROCESS", importance: "STANDARD", shape: "CIRCLE",
      description: "経理・総務の基盤整備",
      effect: "管理効率+20%",
      requirements: [{ type: "資金", count: 1 }, { type: "人材", count: 1 }]
    },

    // R60 Ring
    {
      id: "WELFARE", label: "福利厚生\n導入", ring: "R60", angleDeg: -60, state: "LOCKED",
      domain: "PEOPLE", importance: "STANDARD", shape: "CIRCLE",
      description: "社員の満足度向上施策",
      effect: "定着率+15%",
      requirements: [{ type: "資金", count: 2 }, { type: "信頼", count: 1 }]
    },
    {
      id: "HIRE_MORE", label: "採用\n追加", ring: "R60", angleDeg: -15, state: "LOCKED",
      domain: "PEOPLE", importance: "MAJOR", shape: "CIRCLE", sizeMultiplier: 1.15,
      description: "さらなる人材確保",
      effect: "キャパシティ+50%",
      requirements: [{ type: "資金", count: 3 }, { type: "人材", count: 1 }, { type: "実績", count: 2 }]
    },
    {
      id: "SEC_PREP", label: "セキュリティ\n認証準備", ring: "R60", angleDeg: 45, state: "LOCKED",
      domain: "QUALITY", importance: "STANDARD", shape: "DIAMOND",
      description: "セキュリティ認証の準備段階",
      effect: "大企業案件対応可能",
      requirements: [{ type: "技術", count: 2 }, { type: "時間", count: 2 }]
    },
    {
      id: "SALES_PROCESS", label: "営業\nプロセス", ring: "R60", angleDeg: 115, state: "LOCKED",
      domain: "PROCESS", importance: "MAJOR", shape: "HEXAGON", sizeMultiplier: 1.15,
      description: "営業活動の体系化",
      effect: "受注効率+40%",
      requirements: [{ type: "実績", count: 2 }, { type: "技術", count: 1 }]
    },

    // R100 Ring
    {
      id: "NEW_BIZ", label: "新規事業\n×1", ring: "R100", angleDeg: -30, state: "LOCKED",
      domain: "BUSINESS", importance: "MAJOR", shape: "OCTAGON", sizeMultiplier: 1.2,
      description: "新たな事業領域への進出",
      effect: "収益源の多角化",
      requirements: [{ type: "資金", count: 5 }, { type: "人材", count: 2 }, { type: "実績", count: 3 }]
    },
    {
      id: "FUNCTION_SPLIT", label: "専任機能\n分離", ring: "R100", angleDeg: 30, state: "LOCKED",
      domain: "PEOPLE", importance: "STANDARD", shape: "CIRCLE",
      description: "機能別の専任体制構築",
      effect: "専門性深化",
      requirements: [{ type: "人材", count: 3 }, { type: "資金", count: 2 }]
    },
    {
      id: "SEC_GET", label: "認証\n本取得", ring: "R100", angleDeg: 90, state: "LOCKED",
      domain: "QUALITY", importance: "MAJOR", shape: "DIAMOND", sizeMultiplier: 1.15,
      description: "セキュリティ認証の正式取得",
      effect: "信頼性証明, 大型案件獲得",
      requirements: [{ type: "技術", count: 3 }, { type: "時間", count: 3 }, { type: "資金", count: 2 }]
    },
    {
      id: "LEAD_DEV", label: "リード\n育成", ring: "R100", angleDeg: 160, state: "LOCKED",
      domain: "PEOPLE", importance: "MAJOR", shape: "CIRCLE", sizeMultiplier: 1.15,
      description: "次世代リーダーの育成",
      effect: "組織の持続可能性確保",
      requirements: [{ type: "人材", count: 2 }, { type: "時間", count: 3 }, { type: "信頼", count: 2 }]
    },
  ] as NodeConfig[],

  // エッジデータ（拡張版）
  EDGES: [
    // Core connections (MAIN paths)
    { from: "CORE", to: "HIRE_3", pathType: "MAIN" },
    { from: "CORE", to: "OFFICE_15", pathType: "MAIN" },
    { from: "CORE", to: "PRODUCTIZE", pathType: "MAIN" },
    { from: "CORE", to: "BACKOFFICE", pathType: "MAIN" },

    // PEOPLE domain progression
    { from: "HIRE_3", to: "WELFARE", pathType: "OPTIONAL", curveType: "BEZIER" },
    { from: "HIRE_3", to: "HIRE_MORE", pathType: "MAIN" },
    { from: "HIRE_MORE", to: "FUNCTION_SPLIT", pathType: "MAIN" },
    { from: "FUNCTION_SPLIT", to: "LEAD_DEV", pathType: "MAIN" },

    // PROCESS domain progression
    { from: "PRODUCTIZE", to: "SALES_PROCESS", pathType: "MAIN" },
    { from: "SALES_PROCESS", to: "NEW_BIZ", pathType: "MAIN", curveType: "BEZIER" },

    // QUALITY domain progression
    { from: "SALES_PROCESS", to: "SEC_PREP", pathType: "OPTIONAL", curveType: "BEZIER" },
    { from: "SEC_PREP", to: "SEC_GET", pathType: "MAIN" },

    // Cross-domain
    { from: "BACKOFFICE", to: "SEC_PREP", pathType: "CROSS_DOMAIN", curveType: "BEZIER", curveIntensity: 0.25 },
  ] as EdgeConfig[],
};

// ============================================================
// メインエントリーポイント
// ============================================================

(async function main(): Promise<void> {
  try {
    await loadFonts();
    cleanupExisting();

    const frame = createMainFrame();
    const cx = CONFIG.FRAME.width / 2;
    const cy = CONFIG.FRAME.height / 2;

    // 背景（FF10風強化版）
    createEnhancedBackground(frame, cx, cy);

    // タイトルと説明
    addTitleAndSubtitle(frame);

    // ドメインセクター（微妙な領域表示）
    drawDomainSectors(frame, cx, cy);

    // リング描画
    drawRings(frame, cx, cy);

    // ノードコンポーネント作成
    const variants = createNodeVariants();

    // 位置マップ作成
    const posMap = new Map<string, { x: number; y: number }>();
    for (const n of CONFIG.NODES) {
      const size = getNodeSize(n);
      const pos = computeNodePosition(n, cx, cy);
      posMap.set(n.id, { x: pos.x + size / 2, y: pos.y + size / 2 });
    }

    // コネクタ描画（ノードの下）
    drawConnectors(frame, posMap);

    // ノード配置
    placeNodes(frame, variants, cx, cy);

    // 凡例
    const legend = createLegend(variants);
    legend.x = CONFIG.LEGEND.position.x;
    legend.y = CONFIG.LEGEND.position.y;
    frame.appendChild(legend);

    // コンポーネント非表示
    variants.containerFrame.visible = false;
    variants.containerFrame.locked = true;

    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);

    // UIを表示するように追加
    figma.showUI(__html__, { width: 1000, height: 700, title: "WG Sphere Grid Interactive" });

    figma.notify("WG Sphere Grid (FF10 Style) を生成しました");
  } catch (err) {
    console.error("Error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    figma.notify(`エラー: ${msg}`, { error: true });
  } finally {
    // UIを表示するためここでは閉じない
    // figma.closePlugin();
  }
})();

// ============================================================
// 初期化・クリーンアップ
// ============================================================

async function loadFonts(): Promise<void> {
  const fonts: FontName[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Bold" },
    { family: "Inter", style: "Medium" },
  ];
  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
    } catch {
      console.warn(`Font load failed: ${font.family} ${font.style}`);
    }
  }
}

function cleanupExisting(): void {
  const names = [CONFIG.FRAME.name, CONFIG.FRAME.componentFrameName, "WG Node / Sphere"];
  for (const name of names) {
    const node = figma.currentPage.findOne((n) => n.name === name);
    if (node) node.remove();
  }
}

// ============================================================
// フレーム・背景
// ============================================================

function createMainFrame(): FrameNode {
  const frame = figma.createFrame();
  frame.name = CONFIG.FRAME.name;
  frame.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  frame.clipsContent = true;
  frame.fills = [{ type: "SOLID", color: CONFIG.COLORS.bg.deep }];
  return frame;
}

function createEnhancedBackground(frame: FrameNode, cx: number, cy: number): void {
  const bgGroup = figma.createFrame();
  bgGroup.name = "Background";
  bgGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  bgGroup.x = 0;
  bgGroup.y = 0;
  bgGroup.fills = [];
  bgGroup.strokes = [];
  frame.appendChild(bgGroup);

  // 星空
  if (CONFIG.BACKGROUND.starField.enabled) {
    createStarField(bgGroup, cx, cy);
  }

  // 中心グロー
  if (CONFIG.BACKGROUND.centerGlow.enabled) {
    const glow = figma.createEllipse();
    glow.name = "CenterGlow";
    const r = CONFIG.BACKGROUND.centerGlow.radius;
    glow.resize(r * 2, r * 2);
    glow.x = cx - r;
    glow.y = cy - r;
    glow.fills = [{ type: "SOLID", color: CONFIG.COLORS.bg.glow }];
    glow.opacity = CONFIG.BACKGROUND.centerGlow.opacity;
    glow.strokes = [];
    glow.effects = [{
      type: "LAYER_BLUR",
      radius: CONFIG.BACKGROUND.centerGlow.blurRadius,
      visible: true,
    } as BlurEffect];
    bgGroup.appendChild(glow);
  }

  // ビネット効果
  if (CONFIG.BACKGROUND.vignette.enabled) {
    createVignetteEffect(bgGroup, cx, cy);
  }
}

function createStarField(parent: FrameNode, cx: number, cy: number): void {
  const starGroup = figma.createFrame();
  starGroup.name = "StarField";
  starGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  starGroup.x = 0;
  starGroup.y = 0;
  starGroup.fills = [];
  starGroup.strokes = [];
  parent.appendChild(starGroup);

  // シード付き乱数（再現性のため）
  let seed = 12345;
  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (const layer of CONFIG.BACKGROUND.starField.layers) {
    for (let i = 0; i < layer.count; i++) {
      let x: number, y: number, dist: number;
      let attempts = 0;
      do {
        x = random() * CONFIG.FRAME.width;
        y = random() * CONFIG.FRAME.height;
        dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        attempts++;
      } while (dist < CONFIG.BACKGROUND.starField.avoidRadius && attempts < 50);

      const star = figma.createEllipse();
      const size = layer.sizeRange[0] + random() * (layer.sizeRange[1] - layer.sizeRange[0]);
      star.resize(size, size);
      star.x = x;
      star.y = y;
      star.fills = [{ type: "SOLID", color: CONFIG.COLORS.stars.bright }];
      star.opacity = layer.opacityRange[0] + random() * (layer.opacityRange[1] - layer.opacityRange[0]);
      star.strokes = [];

      // 大きい星にはグロー効果
      if (size > 2.5) {
        star.effects = [{
          type: "DROP_SHADOW",
          color: { ...CONFIG.COLORS.stars.blue, a: 0.5 },
          offset: { x: 0, y: 0 },
          radius: size * 2,
          spread: 0,
          visible: true,
          blendMode: "NORMAL",
        }];
      }

      starGroup.appendChild(star);
    }
  }
}

function createVignetteEffect(parent: FrameNode, cx: number, cy: number): void {
  const diagonal = Math.sqrt(CONFIG.FRAME.width ** 2 + CONFIG.FRAME.height ** 2);
  const radius = diagonal * CONFIG.BACKGROUND.vignette.radiusRatio;

  const vignette = figma.createEllipse();
  vignette.name = "Vignette";
  vignette.resize(radius * 2.2, radius * 2.2);
  vignette.x = cx - radius * 1.1;
  vignette.y = cy - radius * 1.1;
  vignette.fills = [];
  vignette.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  vignette.strokeWeight = radius * 0.5;
  vignette.opacity = CONFIG.BACKGROUND.vignette.intensity;
  vignette.effects = [{
    type: "LAYER_BLUR",
    radius: 180,
    visible: true,
  } as BlurEffect];

  parent.appendChild(vignette);
}

function addTitleAndSubtitle(frame: FrameNode): void {
  // タイトル
  const title = figma.createText();
  title.name = "Title";
  title.fontName = { family: "Inter", style: "Bold" };
  title.characters = "WONDERFUL GROWTH";
  title.fontSize = 32;
  title.letterSpacing = { value: 4, unit: "PIXELS" };
  title.fills = [{ type: "SOLID", color: CONFIG.COLORS.accent.gold }];
  title.effects = [{
    type: "DROP_SHADOW",
    color: { ...CONFIG.COLORS.accent.gold, a: 0.5 },
    offset: { x: 0, y: 0 },
    radius: 20,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];
  title.x = 50;
  title.y = 40;
  frame.appendChild(title);

  // サブタイトル
  const subtitle = figma.createText();
  subtitle.name = "Subtitle";
  subtitle.fontName = { family: "Inter", style: "Medium" };
  subtitle.characters = "企業スフィア盤";
  subtitle.fontSize = 18;
  subtitle.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.7) }];
  subtitle.x = 50;
  subtitle.y = 80;
  frame.appendChild(subtitle);

  // ゲート条件ボックス
  const box = figma.createFrame();
  box.name = "GatesBox";
  box.resize(320, 180);
  box.x = 50;
  box.y = 120;
  box.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.bg.mid, CONFIG.COLORS.bg.deep, 0.7) }];
  box.cornerRadius = 12;
  box.strokes = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.ring, CONFIG.COLORS.bg.deep, 0.4) }];
  box.strokeWeight = 1;
  box.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 16,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];
  frame.appendChild(box);

  // タイトル
  const gatesTitle = figma.createText();
  gatesTitle.name = "GatesTitle";
  gatesTitle.fontName = { family: "Inter", style: "Bold" };
  gatesTitle.characters = CONFIG.GATES_TEXT.title;
  gatesTitle.fontSize = 12;
  gatesTitle.fills = [{ type: "SOLID", color: CONFIG.COLORS.accent.goldDim }];
  gatesTitle.x = 16;
  gatesTitle.y = 14;
  box.appendChild(gatesTitle);

  const gatesText = figma.createText();
  gatesText.name = "GatesText";
  gatesText.fontName = { family: "Inter", style: "Regular" };
  gatesText.characters = CONFIG.GATES_TEXT.conditions.join("\n");
  gatesText.fontSize = 11;
  gatesText.lineHeight = { value: 18, unit: "PIXELS" };
  gatesText.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.75) }];
  gatesText.x = 16;
  gatesText.y = 36;
  box.appendChild(gatesText);
}

// ============================================================
// ドメインセクター
// ============================================================

function drawDomainSectors(frame: FrameNode, cx: number, cy: number): void {
  const sectorGroup = figma.createFrame();
  sectorGroup.name = "DomainSectors";
  sectorGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  sectorGroup.x = 0;
  sectorGroup.y = 0;
  sectorGroup.fills = [];
  sectorGroup.strokes = [];
  sectorGroup.opacity = 0.12;
  frame.appendChild(sectorGroup);

  const arcRadius = CONFIG.RINGS[CONFIG.RINGS.length - 1].radius + 50;

  for (const domain of CONFIG.DOMAINS) {
    if (domain.id === "CORE") continue;

    const startRad = (domain.startAngle * Math.PI) / 180;
    const endRad = (domain.endAngle * Math.PI) / 180;

    const startX = cx + arcRadius * Math.cos(startRad);
    const startY = cy + arcRadius * Math.sin(startRad);
    const endX = cx + arcRadius * Math.cos(endRad);
    const endY = cy + arcRadius * Math.sin(endRad);

    const largeArc = Math.abs(domain.endAngle - domain.startAngle) > 180 ? 1 : 0;
    const pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${endX} ${endY}`;

    const arc = figma.createVector();
    arc.name = `Sector-${domain.id}`;
    arc.vectorPaths = [{ windingRule: "NONE", data: pathData }];
    arc.strokes = [{ type: "SOLID", color: domain.color }];
    arc.strokeWeight = 4;
    arc.strokeCap = "ROUND";
    arc.effects = [{
      type: "LAYER_BLUR",
      radius: 10,
      visible: true,
    } as BlurEffect];

    sectorGroup.appendChild(arc);

    // ドメインラベル
    const labelAngle = (domain.startAngle + domain.endAngle) / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = arcRadius + 30;

    const label = figma.createText();
    label.name = `SectorLabel-${domain.id}`;
    label.fontName = { family: "Inter", style: "Medium" };
    label.characters = domain.label;
    label.fontSize = 10;
    label.fills = [{ type: "SOLID", color: domain.color }];
    label.x = cx + labelRadius * Math.cos(labelRad) - 25;
    label.y = cy + labelRadius * Math.sin(labelRad) - 6;

    sectorGroup.appendChild(label);
  }
}

// ============================================================
// リング描画
// ============================================================

function drawRings(frame: FrameNode, cx: number, cy: number): void {
  const ringsGroup = figma.createFrame();
  ringsGroup.name = "Rings";
  ringsGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  ringsGroup.x = 0;
  ringsGroup.y = 0;
  ringsGroup.fills = [];
  ringsGroup.strokes = [];
  frame.appendChild(ringsGroup);

  for (const r of CONFIG.RINGS) {
    // グロー
    const glow = figma.createEllipse();
    glow.name = `RingGlow-${r.id}`;
    glow.resize(r.radius * 2, r.radius * 2);
    glow.x = cx - r.radius;
    glow.y = cy - r.radius;
    glow.fills = [];
    glow.strokes = [{ type: "SOLID", color: CONFIG.COLORS.ui.ring }];
    glow.strokeWeight = 6;
    glow.opacity = 0.15 * r.glowIntensity;
    glow.effects = [{
      type: "LAYER_BLUR",
      radius: 6,
      visible: true,
    } as BlurEffect];
    ringsGroup.appendChild(glow);

    // メインライン
    const ring = figma.createEllipse();
    ring.name = `Ring-${r.id}`;
    ring.resize(r.radius * 2, r.radius * 2);
    ring.x = cx - r.radius;
    ring.y = cy - r.radius;
    ring.fills = [];
    ring.strokes = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.ring, CONFIG.COLORS.bg.deep, 0.5 + 0.3 * r.glowIntensity) }];
    ring.strokeWeight = 1.5;
    ring.opacity = 0.6 + 0.3 * r.glowIntensity;
    ringsGroup.appendChild(ring);

    // ラベル
    const label = figma.createText();
    label.name = `RingLabel-${r.id}`;
    label.fontName = { family: "Inter", style: "Medium" };
    label.characters = r.label;
    label.fontSize = 12;
    label.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.5 + 0.2 * r.glowIntensity) }];
    label.x = cx + r.radius + 16;
    label.y = cy - 8;
    ringsGroup.appendChild(label);
  }
}

// ============================================================
// ノード
// ============================================================

function getNodeSize(n: NodeConfig): number {
  const baseSize = CONFIG.NODE.sizes[n.importance];
  return baseSize * (n.sizeMultiplier || 1);
}

function createNodeVariants(): VariantSet {
  const compFrame = figma.createFrame();
  compFrame.name = CONFIG.FRAME.componentFrameName;
  compFrame.resize(1200, 400);
  compFrame.fills = [];
  compFrame.strokes = [];
  compFrame.x = -5000;
  compFrame.y = -5000;
  figma.currentPage.appendChild(compFrame);

  const states: NodeState[] = ["LOCKED", "ELIGIBLE", "UNLOCKED", "MASTERED"];
  const shapes: NodeShape[] = ["CIRCLE", "HEXAGON", "DIAMOND", "OCTAGON"];

  const components: ComponentNode[] = [];

  // 全状態×全形状のバリアント作成
  for (const state of states) {
    for (const shape of shapes) {
      const key = `State=${state},Shape=${shape}`;
      const comp = createNodeComponent(key, state, shape);
      compFrame.appendChild(comp);
      components.push(comp);
    }
  }

  const set = figma.combineAsVariants(components, compFrame);
  set.name = "WG Node / Sphere";

  // combineAsVariants後にマップを再構築
  const byKey = new Map<string, ComponentNode>();
  for (const child of set.children) {
    if (child.type === "COMPONENT") {
      const props = child.variantProperties;
      if (props) {
        const key = `State=${props["State"]},Shape=${props["Shape"]}`;
        byKey.set(key, child);
      }
    }
  }

  return { componentSet: set, byKey, containerFrame: compFrame };
}

function createNodeComponent(name: string, state: NodeState, shape: NodeShape): ComponentNode {
  const comp = figma.createComponent();
  comp.name = name;
  const d = CONFIG.NODE.sizes.STANDARD;
  comp.resize(d, d);

  const palette = statePalette(state);
  const domainColor = CONFIG.COLORS.accent.gold; // デフォルト

  // 外側グロー（LOCKED以外）
  if (state !== "LOCKED") {
    const outerGlow = figma.createEllipse();
    outerGlow.name = "OuterGlow";
    outerGlow.resize(d + 24, d + 24);
    outerGlow.x = -12;
    outerGlow.y = -12;
    outerGlow.fills = [{ type: "SOLID", color: palette.glowColor }];
    outerGlow.opacity = state === "MASTERED" ? 0.35 : 0.25;
    outerGlow.strokes = [];
    outerGlow.effects = [{
      type: "LAYER_BLUR",
      radius: state === "MASTERED" ? 24 : 16,
      visible: true,
    } as BlurEffect];
    comp.appendChild(outerGlow);
  }

  // メイン球体（形状別）
  const sphere = createShapeNode(shape, d);
  sphere.name = "Sphere";
  sphere.fills = [{ type: "SOLID", color: palette.fill }];
  sphere.strokes = [{ type: "SOLID", color: palette.stroke }];
  sphere.strokeWeight = palette.strokeWeight;
  sphere.effects = palette.effects;
  comp.appendChild(sphere);

  // ハイライト
  const highlight = figma.createEllipse();
  highlight.name = "Highlight";
  highlight.resize(d * 0.4, d * 0.25);
  highlight.x = d * 0.2;
  highlight.y = d * 0.12;
  highlight.fills = [{ type: "SOLID", color: CONFIG.COLORS.ui.surface }];
  highlight.opacity = state === "LOCKED" ? 0.06 : state === "MASTERED" ? 0.3 : 0.2;
  highlight.strokes = [];
  highlight.effects = [{
    type: "LAYER_BLUR",
    radius: 8,
    visible: true,
  } as BlurEffect];
  comp.appendChild(highlight);

  // 内側リング
  const innerSize = d - CONFIG.NODE.innerRingOffset * 2;
  const innerRing = createShapeNode(shape, innerSize);
  innerRing.name = "InnerRing";
  innerRing.x = CONFIG.NODE.innerRingOffset;
  innerRing.y = CONFIG.NODE.innerRingOffset;
  innerRing.fills = [];
  innerRing.strokes = [{ type: "SOLID", color: palette.ring }];
  innerRing.strokeWeight = 1;
  innerRing.opacity = state === "MASTERED" ? 0.8 : 0.6;
  comp.appendChild(innerRing);

  // ラベル
  const label = figma.createText();
  label.name = "Label";
  label.fontName = { family: "Inter", style: "Bold" };
  label.characters = "NODE";
  label.fontSize = 10;
  label.lineHeight = { value: 12, unit: "PIXELS" };
  label.textAlignHorizontal = "CENTER";
  label.textAlignVertical = "CENTER";
  label.fills = [{ type: "SOLID", color: palette.text }];
  label.resize(d - 16, d - 16);
  label.x = 8;
  label.y = 8;
  comp.appendChild(label);

  // ロックアイコン（LOCKEDのみ）
  if (state === "LOCKED") {
    const lockIcon = figma.createText();
    lockIcon.name = "LockIcon";
    lockIcon.fontName = { family: "Inter", style: "Bold" };
    lockIcon.characters = "🔒";
    lockIcon.fontSize = 12;
    lockIcon.x = d - 18;
    lockIcon.y = 4;
    lockIcon.opacity = 0.5;
    comp.appendChild(lockIcon);
  }

  return comp;
}

function createShapeNode(shape: NodeShape, size: number): EllipseNode | PolygonNode {
  if (shape === "CIRCLE") {
    const node = figma.createEllipse();
    node.resize(size, size);
    node.x = 0;
    node.y = 0;
    return node;
  }

  // 多角形
  const polygon = figma.createPolygon();
  polygon.resize(size, size);
  polygon.x = 0;
  polygon.y = 0;

  switch (shape) {
    case "HEXAGON":
      polygon.pointCount = 6;
      break;
    case "DIAMOND":
      polygon.pointCount = 4;
      break;
    case "OCTAGON":
      polygon.pointCount = 8;
      break;
  }

  return polygon;
}

function placeNodes(frame: FrameNode, variants: VariantSet, cx: number, cy: number): void {
  const nodesGroup = figma.createFrame();
  nodesGroup.name = "Nodes";
  nodesGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  nodesGroup.x = 0;
  nodesGroup.y = 0;
  nodesGroup.fills = [];
  nodesGroup.strokes = [];
  frame.appendChild(nodesGroup);

  // 情報ラベル用グループ
  const infoGroup = figma.createFrame();
  infoGroup.name = "NodeInfo";
  infoGroup.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  infoGroup.x = 0;
  infoGroup.y = 0;
  infoGroup.fills = [];
  infoGroup.strokes = [];
  frame.appendChild(infoGroup);

  for (const n of CONFIG.NODES) {
    const pos = computeNodePosition(n, cx, cy);
    const size = getNodeSize(n);

    const key = `State=${n.state},Shape=${n.shape}`;
    const comp = variants.byKey.get(key);
    if (!comp) continue;

    const inst = comp.createInstance();
    inst.name = `Node-${n.id}`;
    inst.x = pos.x;
    inst.y = pos.y;
    inst.resize(size, size);

    // ラベル設定
    const label = inst.findOne((node) => node.type === "TEXT" && node.name === "Label") as TextNode | null;
    if (label) {
      label.characters = n.label;
      const fontSize = n.importance === "MAJOR" ? 11 : n.importance === "MINOR" ? 9 : 10;
      label.fontSize = fontSize;
    }

    nodesGroup.appendChild(inst);

    // ノード情報ラベル（CORE以外）
    if (n.id !== "CORE") {
      createNodeInfoLabel(infoGroup, n, pos, size, cx, cy);
    }
  }
}

function createNodeInfoLabel(
  parent: FrameNode,
  n: NodeConfig,
  pos: { x: number; y: number },
  size: number,
  cx: number,
  cy: number
): void {
  // ノードの中心座標
  const nodeCenterX = pos.x + size / 2;
  const nodeCenterY = pos.y + size / 2;

  // 中心からの方向を計算してラベル位置を決定
  const dx = nodeCenterX - cx;
  const dy = nodeCenterY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const dirX = dist > 0 ? dx / dist : 0;
  const dirY = dist > 0 ? dy / dist : 1;

  // ラベル配置位置（ノードの外側）
  const labelOffset = size / 2 + 8;
  const labelX = nodeCenterX + dirX * labelOffset;
  const labelY = nodeCenterY + dirY * labelOffset;

  // スフィア情報テキスト作成
  const reqText = n.requirements && n.requirements.length > 0
    ? n.requirements.map(r => `${r.type}×${r.count}`).join(" ")
    : "";

  // 効果テキスト
  const effectText = n.effect || "";

  // 情報が空なら表示しない
  if (!reqText && !effectText) return;

  // テキスト内容組み立て
  const lines: string[] = [];
  if (reqText) lines.push(`◆ ${reqText}`);
  if (effectText) lines.push(`→ ${effectText}`);

  const infoText = figma.createText();
  infoText.name = `Info-${n.id}`;
  infoText.fontName = { family: "Inter", style: "Regular" };
  infoText.characters = lines.join("\n");
  infoText.fontSize = 8;
  infoText.lineHeight = { value: 11, unit: "PIXELS" };

  // 状態に応じた色
  let textColor: RGB;
  switch (n.state) {
    case "MASTERED":
      textColor = CONFIG.COLORS.accent.gold;
      break;
    case "UNLOCKED":
      textColor = CONFIG.COLORS.state.unlocked;
      break;
    case "ELIGIBLE":
      textColor = mixColor(CONFIG.COLORS.accent.gold, CONFIG.COLORS.ui.surface, 0.7);
      break;
    default:
      textColor = mixColor(CONFIG.COLORS.ui.muted, CONFIG.COLORS.bg.deep, 0.5);
  }
  infoText.fills = [{ type: "SOLID", color: textColor }];
  infoText.opacity = n.state === "LOCKED" ? 0.5 : 0.85;

  // 位置調整（方向に応じて）
  const textWidth = 90;
  const textHeight = lines.length * 11;

  // テキストの配置を方向に応じて調整
  if (dirX > 0.5) {
    // 右側
    infoText.x = labelX + 4;
    infoText.y = labelY - textHeight / 2;
    infoText.textAlignHorizontal = "LEFT";
  } else if (dirX < -0.5) {
    // 左側
    infoText.x = labelX - textWidth - 4;
    infoText.y = labelY - textHeight / 2;
    infoText.textAlignHorizontal = "RIGHT";
  } else if (dirY > 0) {
    // 下側
    infoText.x = labelX - textWidth / 2;
    infoText.y = labelY + 4;
    infoText.textAlignHorizontal = "CENTER";
  } else {
    // 上側
    infoText.x = labelX - textWidth / 2;
    infoText.y = labelY - textHeight - 4;
    infoText.textAlignHorizontal = "CENTER";
  }

  parent.appendChild(infoText);
}

function computeNodePosition(n: NodeConfig, cx: number, cy: number): { x: number; y: number } {
  const size = getNodeSize(n);
  if (n.ring === "CORE") {
    return { x: cx - size / 2, y: cy - size / 2 };
  }
  const ring = CONFIG.RINGS.find((r) => r.id === n.ring);
  const radius = ring ? ring.radius : 0;
  const rad = (n.angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad) - size / 2,
    y: cy + radius * Math.sin(rad) - size / 2,
  };
}

// ============================================================
// コネクタ
// ============================================================

function drawConnectors(frame: FrameNode, posMap: Map<string, { x: number; y: number }>): void {
  const connFrame = figma.createFrame();
  connFrame.name = "Connectors";
  connFrame.resize(CONFIG.FRAME.width, CONFIG.FRAME.height);
  connFrame.x = 0;
  connFrame.y = 0;
  connFrame.fills = [];
  connFrame.strokes = [];
  frame.appendChild(connFrame);

  for (const e of CONFIG.EDGES) {
    const a = posMap.get(e.from);
    const b = posMap.get(e.to);
    if (!a || !b) continue;

    const pathConfig = CONFIG.PATH.types[e.pathType];
    const curveType = e.curveType || "STRAIGHT";
    const pathData = calculatePathData(a, b, curveType, e.curveIntensity);

    // グローライン
    const glow = figma.createVector();
    glow.name = `ConnGlow-${e.from}-${e.to}`;
    glow.vectorPaths = [{ windingRule: "NONE", data: pathData }];
    glow.strokes = [{ type: "SOLID", color: CONFIG.COLORS.ui.connector }];
    glow.strokeWeight = pathConfig.strokeWeight + 4;
    glow.strokeCap = "ROUND";
    glow.opacity = pathConfig.glowOpacity;
    glow.effects = [{
      type: "LAYER_BLUR",
      radius: pathConfig.glowRadius,
      visible: true,
    } as BlurEffect];
    connFrame.appendChild(glow);

    // メインライン
    const line = figma.createVector();
    line.name = `Conn-${e.from}-${e.to}`;
    line.vectorPaths = [{ windingRule: "NONE", data: pathData }];

    // BLOCKED用ダッシュパターン
    if (e.pathType === "BLOCKED" && "dashPattern" in pathConfig) {
      line.dashPattern = pathConfig.dashPattern as number[];
    }

    // CROSS_DOMAIN用色ブレンド
    let strokeColor = CONFIG.COLORS.ui.connector;
    if (e.pathType === "CROSS_DOMAIN") {
      strokeColor = mixColor(CONFIG.COLORS.ui.connector, CONFIG.COLORS.accent.goldDim, 0.3);
    }

    line.strokes = [{ type: "SOLID", color: mixColor(strokeColor, CONFIG.COLORS.bg.deep, 0.6) }];
    line.strokeWeight = pathConfig.strokeWeight;
    line.strokeCap = "ROUND";
    line.opacity = pathConfig.opacity;
    connFrame.appendChild(line);
  }
}

function calculatePathData(
  a: { x: number; y: number },
  b: { x: number; y: number },
  curveType: CurveType,
  intensity?: number
): string {
  if (curveType === "STRAIGHT") {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  // Bezier曲線
  const curveAmount = intensity || CONFIG.PATH.defaultCurveIntensity;
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const offset = len * curveAmount;

  // 垂直方向のオフセット
  const cx = midX - (dy / len) * offset;
  const cy = midY + (dx / len) * offset;

  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

// ============================================================
// 凡例
// ============================================================

function createLegend(variants: VariantSet): FrameNode {
  const legend = figma.createFrame();
  legend.name = "Legend";
  legend.resize(CONFIG.LEGEND.size.width, CONFIG.LEGEND.size.height);
  legend.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.bg.mid, CONFIG.COLORS.bg.deep, 0.7) }];
  legend.cornerRadius = 16;
  legend.strokes = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.ring, CONFIG.COLORS.bg.deep, 0.3) }];
  legend.strokeWeight = 1;
  legend.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.4 },
    offset: { x: 0, y: 4 },
    radius: 20,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  // タイトル
  const title = figma.createText();
  title.name = "LegendTitle";
  title.fontName = { family: "Inter", style: "Bold" };
  title.characters = "ノード状態 / Node States";
  title.fontSize = 14;
  title.fills = [{ type: "SOLID", color: CONFIG.COLORS.accent.gold }];
  title.x = 20;
  title.y = 20;
  legend.appendChild(title);

  // 状態アイテム
  let y = 52;
  for (const item of CONFIG.LEGEND.items) {
    const key = `State=${item.state},Shape=CIRCLE`;
    const comp = variants.byKey.get(key);
    if (comp) {
      const inst = comp.createInstance();
      inst.x = 20;
      inst.y = y;
      inst.resize(50, 50);

      const label = inst.findOne((n) => n.type === "TEXT" && n.name === "Label") as TextNode | null;
      if (label) label.characters = item.state.charAt(0);
      legend.appendChild(inst);
    }

    // 日本語ラベル
    const labelJa = figma.createText();
    labelJa.fontName = { family: "Inter", style: "Bold" };
    labelJa.characters = item.label;
    labelJa.fontSize = 13;
    labelJa.fills = [{ type: "SOLID", color: CONFIG.COLORS.ui.surface }];
    labelJa.x = 82;
    labelJa.y = y + 6;
    legend.appendChild(labelJa);

    // 英語ラベル
    const labelEn = figma.createText();
    labelEn.fontName = { family: "Inter", style: "Medium" };
    labelEn.characters = item.labelEn;
    labelEn.fontSize = 10;
    labelEn.fills = [{ type: "SOLID", color: CONFIG.COLORS.ui.surfaceDim }];
    labelEn.x = 82;
    labelEn.y = y + 22;
    legend.appendChild(labelEn);

    // 説明
    const desc = figma.createText();
    desc.fontName = { family: "Inter", style: "Regular" };
    desc.characters = item.description;
    desc.fontSize = 10;
    desc.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.6) }];
    desc.x = 82;
    desc.y = y + 36;
    legend.appendChild(desc);

    y += 75;
  }

  // スフィアタイプセクション
  y += 10;
  const sphereTitle = figma.createText();
  sphereTitle.fontName = { family: "Inter", style: "Bold" };
  sphereTitle.characters = "必要スフィア / Resources";
  sphereTitle.fontSize = 11;
  sphereTitle.fills = [{ type: "SOLID", color: CONFIG.COLORS.accent.goldDim }];
  sphereTitle.x = 20;
  sphereTitle.y = y;
  legend.appendChild(sphereTitle);

  y += 20;
  for (const st of CONFIG.SPHERE_TYPES) {
    // スフィアアイコン（小さな円）
    const sphereIcon = figma.createEllipse();
    sphereIcon.resize(10, 10);
    sphereIcon.x = 25;
    sphereIcon.y = y + 2;
    sphereIcon.fills = [{ type: "SOLID", color: st.color }];
    sphereIcon.strokes = [];
    sphereIcon.effects = [{
      type: "DROP_SHADOW",
      color: { ...st.color, a: 0.5 },
      offset: { x: 0, y: 0 },
      radius: 4,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    }];
    legend.appendChild(sphereIcon);

    // スフィア名
    const stName = figma.createText();
    stName.fontName = { family: "Inter", style: "Medium" };
    stName.characters = st.type;
    stName.fontSize = 10;
    stName.fills = [{ type: "SOLID", color: st.color }];
    stName.x = 42;
    stName.y = y;
    legend.appendChild(stName);

    // スフィア説明
    const stDesc = figma.createText();
    stDesc.fontName = { family: "Inter", style: "Regular" };
    stDesc.characters = st.description;
    stDesc.fontSize = 9;
    stDesc.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.6) }];
    stDesc.x = 80;
    stDesc.y = y;
    legend.appendChild(stDesc);

    y += 16;
  }

  // パスタイプセクション
  y += 12;
  const pathTitle = figma.createText();
  pathTitle.fontName = { family: "Inter", style: "Bold" };
  pathTitle.characters = "接続線タイプ";
  pathTitle.fontSize = 11;
  pathTitle.fills = [{ type: "SOLID", color: CONFIG.COLORS.accent.goldDim }];
  pathTitle.x = 20;
  pathTitle.y = y;
  legend.appendChild(pathTitle);

  // パスタイプ例
  const pathTypes = [
    { type: "MAIN", label: "━ メイン依存" },
    { type: "OPTIONAL", label: "─ オプション" },
    { type: "BLOCKED", label: "┄ ロック越え" },
  ];

  y += 20;
  for (const pt of pathTypes) {
    const ptLabel = figma.createText();
    ptLabel.fontName = { family: "Inter", style: "Regular" };
    ptLabel.characters = pt.label;
    ptLabel.fontSize = 10;
    ptLabel.fills = [{ type: "SOLID", color: mixColor(CONFIG.COLORS.ui.surface, CONFIG.COLORS.bg.deep, 0.7) }];
    ptLabel.x = 25;
    ptLabel.y = y;
    legend.appendChild(ptLabel);
    y += 16;
  }

  return legend;
}

// ============================================================
// ユーティリティ
// ============================================================

function mixColor(c1: RGB, c2: RGB, ratio: number): RGB {
  return {
    r: c1.r * ratio + c2.r * (1 - ratio),
    g: c1.g * ratio + c2.g * (1 - ratio),
    b: c1.b * ratio + c2.b * (1 - ratio),
  };
}

function statePalette(state: NodeState): StatePalette {
  const C = CONFIG.COLORS;

  switch (state) {
    case "LOCKED":
      return {
        fill: mixColor(C.state.locked, C.bg.deep, 0.4),
        stroke: mixColor(C.state.locked, C.bg.deep, 0.6),
        ring: mixColor(C.ui.muted, C.bg.deep, 0.4),
        text: mixColor(C.ui.surface, C.bg.deep, 0.45),
        effects: [],
        glowColor: C.ui.muted,
        strokeWeight: 2,
      };

    case "ELIGIBLE":
      return {
        fill: mixColor(C.accent.goldDim, C.bg.mid, 0.35),
        stroke: C.accent.gold,
        ring: mixColor(C.accent.gold, C.bg.deep, 0.7),
        text: C.ui.surface,
        effects: glowEffect(C.accent.gold, 0.6),
        glowColor: C.accent.gold,
        strokeWeight: 3,
      };

    case "UNLOCKED":
      return {
        fill: mixColor(C.state.unlockedDim, C.bg.mid, 0.35),
        stroke: C.state.unlocked,
        ring: mixColor(C.state.unlocked, C.bg.deep, 0.7),
        text: C.ui.surface,
        effects: glowEffect(C.state.unlocked, 0.6),
        glowColor: C.state.unlocked,
        strokeWeight: 3,
      };

    case "MASTERED":
    default:
      return {
        fill: mixColor(C.accent.gold, C.bg.mid, 0.45),
        stroke: C.accent.goldBright,
        ring: C.accent.gold,
        text: C.ui.surface,
        effects: glowEffect(C.state.mastered, 0.9),
        glowColor: C.accent.goldBright,
        strokeWeight: 4,
      };
  }
}

function glowEffect(color: RGB, strength: number): Effect[] {
  return [
    {
      type: "DROP_SHADOW",
      color: { r: color.r, g: color.g, b: color.b, a: strength },
      offset: { x: 0, y: 0 },
      radius: 16,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: color.r, g: color.g, b: color.b, a: strength * 0.5 },
      offset: { x: 0, y: 0 },
      radius: 32,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
}
