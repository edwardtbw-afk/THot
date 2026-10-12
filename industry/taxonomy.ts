// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "policy", label: "政策", feedLabel: "政策法规", section: "政策与市场", guide: "已发布或生效的法律法规、产业政策、关税与出口退税调整、环保与安全监管、医疗器械注册审批、行业标准实施。征求意见稿、会议通知、领导讲话不算已发生的政策。" },
  { key: "market", label: "行情", feedLabel: "市场行情", section: "政策与市场", guide: "价格、产量、销量、进出口、库存、开工率等市场数据与价格波动，木材、纸浆、钢材、铜、芯片等原材料行情。单个企业自己的经营数据归行业。" },
  { key: "tech", label: "技术", feedLabel: "技术与产品", section: "技术与产品", guide: "新技术、新工艺、新材料、新产品、新设备的发布与投产，智能化改造、节能降耗与质量提升的实质进展。只讲判断不讲具体技术归观点。" },
  { key: "industry", label: "行业", feedLabel: "行业动态", section: "行业动态", guide: "已发生的企业经营、投资并购、产能建设、大额订单、合作、人事、诉讼，以及展会中的实质成交与调查进展。活动预告和会议通知不归这里。" },
  { key: "paper", label: "报告", feedLabel: "研究报告", section: "研究与报告", guide: "行业研究报告、运行分析、技术论文、数据统计、检测方法。协会发布的月度、年度运行数据公报归这里。" },
  { key: "opinion", label: "观点", section: "观点与评论", guide: "重点是作者的解释、判断、主张、预测、评论或访谈观点。讨论市场不自动归行情，作者是专家不自动归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["gdp", "pmi", "cpi", "ppi", "fda", "ce", "iso", "gb", "关税", "出口退税", "反倾销", "产能", "智能制造"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 * 本站类型含义：model_release=重大技术/工艺/材料突破；product_launch=新产品、新设备、新产线投产；
 * tool_or_prompt=可直接复用的标准、方法与选型指南；research_paper=研究报告、论文与数据统计；
 * industry_event=政策、贸易、投资并购、价格变动与人事；opinion_analysis=观点、判断、复盘与访谈；
 * tutorial_explainer=解读、科普与评测。
 */
export const ITEM_TYPES = ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "产品/技术", "政策/监管", "市场/行情", "行业动态", "研究报告", "标准/认证", "观点/评论", "展会/会议",
  "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "木材/人造板", "家具/家居", "造纸/纸制品", "印刷/包装", "医疗器械", "汽车", "船舶/海工", "机床", "工程机械", "仪器仪表", "家电", "电机/电气", "半导体/芯片", "消费电子", "智能制造", "进出口/贸易",
] as const;

/** 可选的实体标签（机构、公司、平台）。 */
export const ENTITY_TAGS = ["工信部", "商务部", "海关总署", "国家药监局", "市场监管总局", "海尔", "美的", "华为", "比亚迪", "吉利", "宁德时代", "中芯国际", "三一重工", "徐工", "中船集团"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 关税: "进出口/贸易",
  价格: "市场/行情", 行情: "市场/行情", 市场: "市场/行情", 涨价: "市场/行情", 降价: "市场/行情",
  进出口: "进出口/贸易", 贸易: "进出口/贸易", 出口: "进出口/贸易", 进口: "进出口/贸易", 反倾销: "进出口/贸易",
  报告: "研究报告", 研究: "研究报告", 论文: "研究报告", 数据: "研究报告", 白皮书: "研究报告",
  标准: "标准/认证", 认证: "标准/认证", 检测: "标准/认证",
  观点: "观点/评论", 评论: "观点/评论", 访谈: "观点/评论",
  展会: "展会/会议", 会议: "展会/会议", 通知: "展会/会议",
  行业: "行业动态", 动态: "行业动态", 并购: "行业动态", 融资: "行业动态", 投资: "行业动态", 合作: "行业动态",
  新品: "产品/技术", 技术: "产品/技术", 产品: "产品/技术", 设备: "产品/技术", 投产: "产品/技术",
  木材: "木材/人造板", 人造板: "木材/人造板", 胶合板: "木材/人造板", 原木: "木材/人造板", 锯材: "木材/人造板",
  家具: "家具/家居", 家居: "家具/家居", 红木: "家具/家居",
  造纸: "造纸/纸制品", 纸浆: "造纸/纸制品", 纸: "造纸/纸制品", 纸制品: "造纸/纸制品",
  印刷: "印刷/包装", 包装: "印刷/包装",
  医疗: "医疗器械", 器械: "医疗器械", 耗材: "医疗器械",
  整车: "汽车", 新能源车: "汽车",
  船舶: "船舶/海工", 造船: "船舶/海工", 海工: "船舶/海工",
  仪器: "仪器仪表", 仪表: "仪器仪表",
  电气: "电机/电气", 电机: "电机/电气",
  芯片: "半导体/芯片", 半导体: "半导体/芯片", 晶圆: "半导体/芯片", 封测: "半导体/芯片",
  手机: "消费电子", 电子: "消费电子",
  智能工厂: "智能制造", 机器人: "智能制造", 自动化: "智能制造", 数字化: "智能制造",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 * 本站目前按主题标签归类，暂不需要公司名录，留空即可随时增补。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
