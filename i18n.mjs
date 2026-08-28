export const SUPPORTED_LOCALES = Object.freeze(['ja', 'en']);

export const SEMANTIC_TEXT = Object.freeze({
  APP_DESCRIPTION: { ja: 'ひとつの落書きから、人間とWebMCPエージェントが共同編集する時間付きMVプロジェクトを作ります。', en: 'One doodle becomes a shared time-coded MV project that a human and WebMCP agent edit together.' },
  RELATIONSHIP_CORE: { ja: 'あなたは私、私はあなた。', en: 'You are me, I am you.' },
  INTRO: { ja: 'ひとつの落書きが、見える15秒のMVグラフになります。人間とエージェントは同じローカルプロジェクトを読み、更新します。', en: 'One human doodle becomes a visible 15-second MV graph. Human and agent read and mutate the same local project.' },
  LANGUAGE_LABEL: { ja: '表示言語', en: 'Language' },
  LANG_JA: { ja: '日本語', en: 'Japanese' },
  LANG_EN: { ja: '英語', en: 'English' },
  WEBMCP_CHECKING: { ja: 'WebMCPを確認中…', en: 'Checking WebMCP…' },
  WEBMCP_UNAVAILABLE: { ja: 'このブラウザではWebMCPを利用できません。人間向け編集機能はローカルで動作します。', en: 'WebMCP unavailable in this browser; the human editor still works locally.' },
  WEBMCP_READY: { ja: 'WebMCP準備完了 · native toolを{count}/{expected}件発見', en: 'WebMCP ready · {count}/{expected} native tools discovered' },
  WEBMCP_FAILED: { ja: 'WebMCP登録失敗 · {error}', en: 'WebMCP registration failed · {error}' },
  TOOL_LIST_LABEL: { ja: '発見したtool IDと説明', en: 'Discovered tool IDs and descriptions' },
  CHOOSE_DOODLE: { ja: '落書き画像を選ぶ', en: 'Choose a doodle image' },
  PREVIEW_ALT: { ja: '人間とエージェントが共有する落書き', en: 'Uploaded doodle shared by human and agent' },
  DEFAULT_TITLE: { ja: '落書きMV', en: 'Doodle MV' },
  MV_TITLE_LABEL: { ja: 'MVタイトル', en: 'MV title' },
  MOOD_LABEL: { ja: 'ムード', en: 'Mood' },
  MOOD_DREAM: { ja: '夢', en: 'Dream' },
  MOOD_UNEASY: { ja: '不穏', en: 'Uneasy' },
  MOOD_ANIME: { ja: 'アニメ', en: 'Anime' },
  MOOD_INTENSE: { ja: '強烈', en: 'Intense' },
  MOOD_EMOTIONAL: { ja: '感情的', en: 'Emotional' },
  CREATE_PLAN: { ja: '15秒プランを作る', en: 'Create 15s plan' },
  LOAD_DEMO: { ja: 'デモ落書きを読み込む', en: 'Load demo doodle' },
  SHARED_SOURCE: { ja: '共有ソース', en: 'SHARED SOURCE' },
  NO_PROJECT: { ja: 'プロジェクトはまだありません', en: 'No project yet' },
  UPLOAD_BEGIN: { ja: '落書きを読み込むと開始します。', en: 'Upload a doodle to begin.' },
  IMAGE_PALETTE: { ja: '画像パレット', en: 'Image palette' },
  VISIBLE_TIME_GRAPH: { ja: '見える時間グラフ', en: 'VISIBLE TIME GRAPH' },
  SAVE_PROJECT: { ja: 'プロジェクトを保存', en: 'Save project' },
  PREPARE_VIDEO: { ja: '動画準備', en: 'Prepare video' },
  RUN_NATIVE_PROOF: { ja: 'native WebMCP証明を実行', en: 'Run native WebMCP proof' },
  FOOT: { ja: 'ピクセル解析はブラウザ内・追加費用ゼロです。落書きは有料providerへ送信されません。検証済み動画executorがなければ、正直に prompt_ready で停止します。', en: 'Pixel analysis is browser-local and zero-spend. No uploaded doodle is sent to a paid provider. When no verified video executor exists, the project stops truthfully at prompt_ready.' },
  STATUS_READING_PIXELS: { ja: 'ピクセルをローカル解析中…', en: 'Reading pixels locally…' },
  STATUS_ANALYZED: { ja: '落書きをローカル解析しました。人間とエージェントはこの同じプロジェクトを共有しています。', en: 'Doodle analyzed locally. Human and agent now share this exact project.' },
  STATUS_ANALYSIS_FAILED: { ja: '解析失敗: {error}', en: 'Analysis failed: {error}' },
  STATUS_UPDATED: { ja: '{source}が同じ共有プロジェクトを更新しました。', en: '{source} updated the same shared project.' },
  SOURCE_HUMAN: { ja: '人間', en: 'Human' },
  SOURCE_AGENT: { ja: 'エージェント', en: 'Agent' },
  STATUS_SAVED: { ja: 'ローカルのプロジェクト履歴へ保存しました。', en: 'Saved to local project history.' },
  STATUS_PROMPT_READY: { ja: 'prompt_ready · 有料providerのcredential/executorは未検証 · 偽の動画成功を主張しません', en: 'prompt_ready · no paid provider credential/executor verified · no fake video claimed' },
  STATUS_UPLOAD_FIRST: { ja: '先に落書きを読み込んでください。', en: 'Upload a doodle first.' },
  STATUS_NATIVE_RESULT: { ja: 'native WebMCPが set_mood → {mood} を実行しました。見えるプロジェクトと永続状態が変化しました。', en: 'Native WebMCP executed set_mood → {mood}. The visible project and persisted state changed.' },
  NATIVE_RESULT_OUTPUT: { ja: 'native executeTool({tool}) result: {result}', en: 'native executeTool({tool}) result: {result}' },
  STATUS_NATIVE_FAILED: { ja: 'native WebMCP証明に失敗 · {error}', en: 'Native WebMCP proof failed · {error}' },
  STATUS_DEMO_FAILED: { ja: 'デモ落書き読込失敗 · {error}', en: 'Demo doodle load failed · {error}' },
  STATUS_AGENT_REWROTE: { ja: 'エージェントが見えるshotを書き換えました。', en: 'Agent rewrote a visible shot.' },
  STATUS_AGENT_REORDERED: { ja: 'エージェントがshotを並べ替え、timecodeを再構築しました。', en: 'Agent reordered shots and rebuilt timecodes.' },
  ANALYSIS_SUMMARY: { ja: '{tone}。{movement}。', en: '{tone}. {movement}.' },
  METRICS: { ja: '明るさ {brightness}% · コントラスト {contrast}% · {orientation}', en: 'Brightness {brightness}% · Contrast {contrast}% · {orientation}' },
  ORIENTATION_PORTRAIT: { ja: '縦長', en: 'portrait' },
  ORIENTATION_LANDSCAPE: { ja: '横長', en: 'landscape' },
  ORIENTATION_SQUARE: { ja: '正方形', en: 'square' },
  TONE_DARK: { ja: '暗く親密で神秘的、小さな光が残る', en: 'dark, intimate and mysterious with small points of light' },
  TONE_BRIGHT: { ja: '明るく繊細で希望があり、余白が軽やか', en: 'bright, fragile and hopeful with airy negative space' },
  TONE_GRAPHIC: { ja: 'グラフィカルで力強く、感情の輪郭が鋭い', en: 'graphic, energetic and emotionally sharp' },
  TONE_SOFT: { ja: '柔らかく懐かしく、少し夢のよう', en: 'soft, nostalgic and slightly dreamlike' },
  MOVEMENT_PORTRAIT: { ja: '垂直上昇、落ちる粒子、被写体へ寄る動き', en: 'vertical rise, falling particles and close subject movement' },
  MOVEMENT_LANDSCAPE: { ja: '横方向のparallax、環境の漂い、cinematicなcamera移動', en: 'sideways parallax, environmental drift and cinematic camera travel' },
  MOVEMENT_SQUARE: { ja: '中心からの拡張、軌道運動、形状morphing', en: 'centered expansion, orbit and shape morphing' },
  SHOT_1_ACTION: { ja: '元の落書きが、不完全な輪郭を失わずに目覚める。{tone}。', en: 'The original doodle wakes without losing its imperfect outline. {tone}.' },
  SHOT_2_ACTION: { ja: 'cameraが、{orientation}構図から生まれる動きを追う。', en: 'The camera follows the doodle through motion suggested by its {orientation} composition.' },
  SHOT_3_ACTION: { ja: '変化したsceneが最初の線へ戻り、人間は最後まで同じ絵だと認識できる。', en: 'The changed scene returns to the first line so the human can recognize the same drawing at the end.' },
  SHOT_1_PROMPT: { ja: '{title}; opening shot; {mood} mood; 元の落書きのidentityを保持; palette {palette}; {movement}; 穏やかなreveal', en: '{title}; opening shot; {mood} mood; preserve the uploaded doodle identity; palette {palette}; {movement}; gentle reveal' },
  SHOT_2_PROMPT: { ja: '{title}; middle shot; {mood} mood; brightness {brightness}%; contrast {contrast}%; palette {palette}; {movement}; 変化するhand-drawn forms', en: '{title}; middle shot; {mood} mood; brightness {brightness}%; contrast {contrast}%; palette {palette}; {movement}; evolving hand-drawn forms' },
  SHOT_3_PROMPT: { ja: '{title}; closing shot; {mood} mood; 元の落書きsilhouetteへ戻る; palette {palette}; emotional closure; text overlayなし', en: '{title}; closing shot; {mood} mood; return to original doodle silhouette; palette {palette}; emotional closure; no text overlay' },
  TOOL_READ_TITLE: { ja: '現在のMVプロジェクトを読む', en: 'Read current MV project' },
  TOOL_READ_DESC: { ja: '人間に見えている現在のMVプロジェクトを正確に読みます。', en: 'Read the exact MV project currently visible to the human.' },
  TOOL_ANALYZE_TITLE: { ja: '現在の落書きを解析', en: 'Analyze current doodle' },
  TOOL_ANALYZE_DESC: { ja: 'ローカル画像由来のpalette、明るさ、contrast、向き、動き、toneを返します。', en: 'Return image-derived local palette, brightness, contrast, orientation, movement and tone.' },
  TOOL_CREATE_TITLE: { ja: 'MVプランを作る', en: 'Create MV plan' },
  TOOL_CREATE_DESC: { ja: 'agent指定のtitle/moodで共有15秒プランを再生成します。', en: 'Regenerate the shared visible 15-second plan using agent-supplied title/mood without DOM overwrite.' },
  TOOL_MOOD_TITLE: { ja: 'ムードを設定', en: 'Set mood' },
  TOOL_MOOD_DESC: { ja: '同じ人間可視プロジェクトのmoodを変更します。', en: 'Change mood on the same human-visible project.' },
  TOOL_PROPOSE_TITLE: { ja: 'shotを提案', en: 'Propose a shot' },
  TOOL_PROPOSE_DESC: { ja: '人間のreview用に現在のshotをひとつ読みます。', en: 'Read one current shot for human review.' },
  TOOL_REWRITE_TITLE: { ja: 'shotを書き換える', en: 'Rewrite a shot' },
  TOOL_REWRITE_DESC: { ja: '同じ見えるプロジェクト内のshotをひとつ書き換えます。', en: 'Rewrite one shot in the same visible project.' },
  TOOL_REORDER_TITLE: { ja: 'shotを並べ替える', en: 'Reorder shots' },
  TOOL_REORDER_DESC: { ja: '全shotを並べ替え、整合するstart/end timecodeを再構築します。', en: 'Reorder all shots and rebuild coherent start/end timecodes.' },
  TOOL_PROVIDER_TITLE: { ja: 'provider利用可否を確認', en: 'Inspect provider availability' },
  TOOL_PROVIDER_DESC: { ja: '追加費用ゼロの正直なprovider状態を返します。', en: 'Return truthful zero-spend provider state.' },
  TOOL_SAVE_TITLE: { ja: 'MVプロジェクトを保存', en: 'Save MV project' },
  TOOL_SAVE_DESC: { ja: '同じ共有プロジェクトをlocalStorageへ永続化します。', en: 'Persist the exact shared project to localStorage.' },
  TOOL_RENDER_TITLE: { ja: '動画をrenderまたは準備', en: 'Render or prepare video' },
  TOOL_RENDER_DESC: { ja: '未検証の有料renderingを主張せずpromptを準備します。', en: 'Prepare prompts without claiming unverified paid rendering.' },
});

export function normalizeLocale(value) {
  const locale = String(value || '').toLowerCase().split('-')[0];
  return SUPPORTED_LOCALES.includes(locale) ? locale : null;
}

export function resolveLocale({ search = '', stored = '', languages = [] } = {}) {
  const query = normalizeLocale(new URLSearchParams(search).get('lang'));
  if (query) return query;
  const saved = normalizeLocale(stored);
  if (saved) return saved;
  for (const language of languages) {
    const normalized = normalizeLocale(language);
    if (normalized) return normalized;
  }
  return 'en';
}

export function translate(token, locale, params = {}) {
  const entry = SEMANTIC_TEXT[token];
  if (!entry) return token;
  const template = entry[normalizeLocale(locale) || 'en'];
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

export function assertLocaleParity() {
  return Object.entries(SEMANTIC_TEXT).filter(([, value]) => SUPPORTED_LOCALES.some((locale) => !value[locale]));
}
