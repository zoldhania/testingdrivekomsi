/**
 * FileVault — Drag & Drop File Repository
 * app.js
 */

// ================================================
//  FILE ICON HELPER
// ================================================
const FILE_ICONS = {
  // Images
  jpg: { color: '#F59E0B', label: 'IMG' },
  jpeg: { color: '#F59E0B', label: 'IMG' },
  png: { color: '#F59E0B', label: 'IMG' },
  gif: { color: '#F59E0B', label: 'GIF' },
  svg: { color: '#00A651', label: 'SVG' },
  webp: { color: '#F59E0B', label: 'IMG' },
  // Video
  mp4: { color: '#EF4444', label: 'VID' },
  mov: { color: '#EF4444', label: 'VID' },
  avi: { color: '#EF4444', label: 'VID' },
  mkv: { color: '#EF4444', label: 'VID' },
  // Audio
  mp3: { color: '#8B5CF6', label: 'AUD' },
  wav: { color: '#8B5CF6', label: 'AUD' },
  flac: { color: '#8B5CF6', label: 'AUD' },
  // Code
  js: { color: '#F7DF1E', label: 'JS' },
  ts: { color: '#3178C6', label: 'TS' },
  jsx: { color: '#61DAFB', label: 'JSX' },
  tsx: { color: '#61DAFB', label: 'TSX' },
  html: { color: '#E34F26', label: 'HTML' },
  css: { color: '#1572B6', label: 'CSS' },
  scss: { color: '#CC6699', label: 'SCSS' },
  py: { color: '#3776AB', label: 'PY' },
  java: { color: '#ED8B00', label: 'JAVA' },
  go: { color: '#00ADD8', label: 'GO' },
  rs: { color: '#CE412B', label: 'RS' },
  php: { color: '#777BB4', label: 'PHP' },
  rb: { color: '#CC342D', label: 'RB' },
  cpp: { color: '#00599C', label: 'C++' },
  c: { color: '#555555', label: 'C' },
  // Data
  json: { color: '#FFD700', label: 'JSON' },
  xml: { color: '#F06529', label: 'XML' },
  yaml: { color: '#CB171E', label: 'YAML' },
  yml: { color: '#CB171E', label: 'YML' },
  csv: { color: '#16A34A', label: 'CSV' },
  sql: { color: '#F97316', label: 'SQL' },
  // Docs
  pdf: { color: '#DC2626', label: 'PDF' },
  doc: { color: '#2B579A', label: 'DOC' },
  docx: { color: '#2B579A', label: 'DOCX' },
  xls: { color: '#217346', label: 'XLS' },
  xlsx: { color: '#217346', label: 'XLSX' },
  ppt: { color: '#D24726', label: 'PPT' },
  pptx: { color: '#D24726', label: 'PPTX' },
  txt: { color: '#9CA3AF', label: 'TXT' },
  md: { color: '#818CF8', label: 'MD' },
  // Archive
  zip: { color: '#78716C', label: 'ZIP' },
  rar: { color: '#78716C', label: 'RAR' },
  tar: { color: '#78716C', label: 'TAR' },
  gz: { color: '#78716C', label: 'GZ' },
  // Font
  ttf: { color: '#06B6D4', label: 'TTF' },
  otf: { color: '#06B6D4', label: 'OTF' },
  woff: { color: '#06B6D4', label: 'WOFF' },
};

// ================================================
//  FILE ALLOWLIST & SIZE LIMITS
// ================================================
const ALLOWED_PHOTO_EXTS = new Set(['jpg', 'jpeg', 'png']);
const ALLOWED_VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']);
const ALLOWED_ALL_EXTS = new Set([...ALLOWED_PHOTO_EXTS, ...ALLOWED_VIDEO_EXTS]);
const MAX_PHOTO_SIZE = 50 * 1024 * 1024;        // 50 MB
const MAX_VIDEO_SIZE = 1 * 1024 * 1024 * 1024; // 1 GB
const MAX_FILES_PER_UPLOAD = 50;                 // Max 50 file per batch

function validateFile(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_ALL_EXTS.has(ext)) return { ok: false, reason: `Format .${ext} tidak diizinkan` };
  if (ALLOWED_PHOTO_EXTS.has(ext) && file.size > MAX_PHOTO_SIZE)
    return { ok: false, reason: `Foto melebihi batas 8 MB (${formatSize(file.size)})` };
  if (ALLOWED_VIDEO_EXTS.has(ext) && file.size > MAX_VIDEO_SIZE)
    return { ok: false, reason: `Video melebihi batas 1 GB (${formatSize(file.size)})` };
  return { ok: true };
}

function getExt(name) {
  return (name.split('.').pop() || '').toLowerCase();
}

function getFileInfo(name) {
  const ext = getExt(name);
  return FILE_ICONS[ext] || { color: '#6875A3', label: ext.toUpperCase().slice(0, 4) || 'FILE' };
}

function buildFileIcon(name, size = 48) {
  const info = getFileInfo(name);
  const ext = getExt(name).toUpperCase().slice(0, 4) || 'FILE';
  const r = size / 2;
  return `<svg viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${size * 0.12}" fill="${info.color}22" stroke="${info.color}" stroke-width="1.5"/>
    <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle"
      font-size="${size * 0.24}" font-family="Inter,sans-serif" font-weight="700" fill="${info.color}">${ext}</text>
  </svg>`;
}

function buildFolderIcon(size = 48, open = false, shared = false) {
  const col = shared ? '#D97706' : '#0066B3';
  const fillOp = shared ? '0.25' : '0.2';
  return `<svg viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 ${Math.round(size * 0.32)}h${Math.round(size * 0.31)}l${Math.round(size * 0.12)} ${Math.round(size * 0.12)}h${Math.round(size * 0.37)}v${Math.round(size * 0.44)}H6z" fill="${col}" fill-opacity="${fillOp}" stroke="${col}" stroke-width="1.5" stroke-linejoin="round"/>
    ${open ? `<path d="M6 ${Math.round(size * 0.44)}l${Math.round(size * 0.05)}-${Math.round(size * 0.12)}h${Math.round(size * 0.75)}l-${Math.round(size * 0.06)} ${Math.round(size * 0.44)}H6z" fill="${col}" fill-opacity="0.35"/>` : ''}
  </svg>`;
}

// ================================================
//  FILE REPOSITORY (in-memory)
// ================================================
/**
 * Node structure:
 * { id, name, type: 'folder'|'file', path, children: [], file: File|null, parent: nodeId|null }
 */
let repoRoot = { id: 'root', name: 'root', type: 'folder', path: '', children: [], file: null, parent: null };
let recycleRoot = { id: 'recycle_bin', name: 'Recycle Bin', type: 'folder', path: 'recycle_bin', children: [], file: null, parent: null };
let nodeMap = { root: repoRoot, recycle_bin: recycleRoot };
let nodeIdSeq = 0;
let totalFiles = 0;
let currentPath = ''; // root = ''
let currentSearchQuery = '';
let currentSortMode = 'name_asc';
let viewMode = 'grid'; // 'grid' | 'list'
let selectedIds = new Set(); // multi-select
let lastClickedIdx = -1; // for shift+click range
let iconSizeLevel = 2; // 1=small 2=medium 3=large

// ================================================
//  BRANCH OFFICES LIST
// ================================================
const BRANCH_OFFICES = [
  // === KANTOR CABANG ===
  { id: 'kc_jakarta_pusat',     name: 'KC Jakarta Pusat',       type: 'cabang' },
  { id: 'kc_jakarta_selatan',   name: 'KC Jakarta Selatan',     type: 'cabang' },
  { id: 'kc_jakarta_utara',     name: 'KC Jakarta Utara',       type: 'cabang' },
  { id: 'kc_jakarta_barat',     name: 'KC Jakarta Barat',       type: 'cabang' },
  { id: 'kc_jakarta_timur',     name: 'KC Jakarta Timur',       type: 'cabang' },
  { id: 'kc_surabaya',         name: 'KC Surabaya',             type: 'cabang' },
  { id: 'kc_bandung',          name: 'KC Bandung',              type: 'cabang' },
  { id: 'kc_medan',            name: 'KC Medan',                type: 'cabang' },
  { id: 'kc_semarang',         name: 'KC Semarang',             type: 'cabang' },
  { id: 'kc_yogyakarta',       name: 'KC Yogyakarta',           type: 'cabang' },
  { id: 'kc_makassar',         name: 'KC Makassar',             type: 'cabang' },
  { id: 'kc_palembang',        name: 'KC Palembang',            type: 'cabang' },
  { id: 'kc_batam',            name: 'KC Batam',                type: 'cabang' },
  { id: 'kc_pekanbaru',        name: 'KC Pekanbaru',            type: 'cabang' },
  { id: 'kc_denpasar',         name: 'KC Denpasar',             type: 'cabang' },
  { id: 'kc_balikpapan',       name: 'KC Balikpapan',           type: 'cabang' },
  { id: 'kc_manado',           name: 'KC Manado',               type: 'cabang' },
  { id: 'kc_pontianak',        name: 'KC Pontianak',            type: 'cabang' },
  { id: 'kc_malang',           name: 'KC Malang',               type: 'cabang' },
  { id: 'kc_bogor',            name: 'KC Bogor',                type: 'cabang' },
  // === KEDEPUTIAN WILAYAH ===
  { id: 'kw_sumatera_utara',   name: 'Kedeputian Wilayah Sumatera Utara',   type: 'wilayah' },
  { id: 'kw_sumatera_selatan', name: 'Kedeputian Wilayah Sumatera Selatan', type: 'wilayah' },
  { id: 'kw_jawa_barat',       name: 'Kedeputian Wilayah Jawa Barat',       type: 'wilayah' },
  { id: 'kw_jawa_tengah',      name: 'Kedeputian Wilayah Jawa Tengah',      type: 'wilayah' },
  { id: 'kw_jawa_timur',       name: 'Kedeputian Wilayah Jawa Timur',       type: 'wilayah' },
  { id: 'kw_kalimantan',       name: 'Kedeputian Wilayah Kalimantan',       type: 'wilayah' },
  { id: 'kw_sulawesi',         name: 'Kedeputian Wilayah Sulawesi',         type: 'wilayah' },
  { id: 'kw_bali_nusra',       name: 'Kedeputian Wilayah Bali & Nusra',    type: 'wilayah' },
  { id: 'kw_maluku_papua',     name: 'Kedeputian Wilayah Maluku & Papua',  type: 'wilayah' },
  { id: 'kw_dki',              name: 'Kedeputian Wilayah DKI Jakarta',      type: 'wilayah' },
];

// ================================================
//  SHARE REGISTRY
// ================================================
// Structure: { [nodeId]: { shares: [{officeId, expiredAt}], sharedAt, sharedBy } }
let shareRegistry = {};

function loadShareRegistry() {
  try { shareRegistry = JSON.parse(localStorage.getItem('fv_shares') || '{}'); } catch { shareRegistry = {}; }
  // Auto-clean entries older than 1 year + 30 days to save space
  const cutoff = Date.now() - 395 * 24 * 60 * 60 * 1000;
  Object.keys(shareRegistry).forEach(nodeId => {
    const reg = shareRegistry[nodeId];
    if (reg.shares) reg.shares = reg.shares.filter(s => s.expiredAt > cutoff);
    if (!reg.shares || !reg.shares.length) delete shareRegistry[nodeId];
  });
  saveShareRegistry();
}

function saveShareRegistry() {
  localStorage.setItem('fv_shares', JSON.stringify(shareRegistry));
}

/** Get active (non-expired) shares for a node */
function getActiveShares(nodeId) {
  const reg = shareRegistry[nodeId];
  if (!reg || !reg.shares) return [];
  const now = Date.now();
  return reg.shares.filter(s => s.expiredAt > now);
}

/** Check if a specific office has active access to a node */
function isSharedWithOffice(nodeId, officeId) {
  return getActiveShares(nodeId).some(s => s.officeId === officeId);
}

/** Check if a node (folder) is shared with ANY office (for visual badge) */
function isFolderShared(nodeId) {
  const reg = shareRegistry[nodeId];
  if (!reg || !reg.shares || !reg.shares.length) return false;
  return reg.shares.some(s => s.expiredAt > Date.now());
}

/** Check if a node was shared but ALL shares are expired */
function isFolderExpiredShare(nodeId) {
  const reg = shareRegistry[nodeId];
  if (!reg || !reg.shares || !reg.shares.length) return false;
  const now = Date.now();
  const hasAny = reg.shares.length > 0;
  const allExpired = reg.shares.every(s => s.expiredAt <= now);
  return hasAny && allExpired;
}

/**
 * Check if office has access to nodeId OR any ancestor folder.
 * This enables recursive folder visibility: if parent shared, subfolders visible.
 */
function officeCanAccessNode(nodeId, officeId) {
  let cur = getNode(nodeId);
  while (cur && cur.id !== 'root') {
    if (isSharedWithOffice(cur.id, officeId)) return true;
    cur = cur.parent ? getNode(cur.parent) : null;
  }
  return false;
}

// ================================================
//  USER ROLE & SESSION
// ================================================
let currentUser = { name: 'User', role: 'super_admin', officeId: null, npp: '', jabatan: '' };

function canDelete()  { return currentUser.role === 'super_admin'; }
function canRename()  { return currentUser.role === 'super_admin' || currentUser.role === 'admin'; }
function canUpload()  { return currentUser.role === 'super_admin' || currentUser.role === 'admin'; }
function canShare()   { return currentUser.role === 'super_admin' || currentUser.role === 'admin'; }
function isViewOnly() { return currentUser.role === 'kantor_cabang' || currentUser.role === 'kedeputian_wilayah'; }

function setRole(role, name, officeId, npp, jabatan) {
  currentUser = {
    name:     name     || currentUser.name,
    role,
    officeId: officeId || null,
    npp:      npp      || '',
    jabatan:  jabatan  || '',
  };
  sessionStorage.setItem('fv_user', JSON.stringify(currentUser));
  // Apply view-only body class
  if (isViewOnly()) {
    document.body.classList.add('view-only-mode');
    const banner = document.getElementById('viewOnlyBanner');
    if (banner) banner.classList.add('visible');
    const officeNameEl = document.getElementById('viewOnlyOfficeName');
    if (officeNameEl && officeId) {
      const office = BRANCH_OFFICES.find(o => o.id === officeId);
      if (officeNameEl) officeNameEl.textContent = office ? office.name : '';
    }
  } else {
    document.body.classList.remove('view-only-mode');
    const banner = document.getElementById('viewOnlyBanner');
    if (banner) banner.classList.remove('visible');
  }
  updateUserChip();
  updateSelectionBar();
}

function updateUserChip() {
  const chip = document.getElementById('userChip');
  if (!chip) return;
  const avatar = document.getElementById('userChipAvatar');
  const nameEl = document.getElementById('userChipName');
  const subEl  = document.getElementById('userChipSub');
  const roleEl = document.getElementById('userChipRole');

  const initials = (currentUser.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  if (avatar) {
    avatar.textContent = initials;
    avatar.title = currentUser.npp ? `NPP: ${currentUser.npp}` : '';
  }
  if (nameEl) nameEl.textContent = currentUser.name || 'User';
  if (subEl) {
    const parts = [];
    if (currentUser.npp) parts.push(currentUser.npp);
    if (currentUser.jabatan) parts.push(currentUser.jabatan);
    subEl.textContent = parts.join(' • ');
    subEl.title = parts.join(' • ');
  }
  if (roleEl) {
    const labels = {
      super_admin:        'Super Admin',
      admin:              'Admin',
      kantor_cabang:      '🏢 KC',
      kedeputian_wilayah: '🏛️ KW',
    };
    roleEl.textContent = labels[currentUser.role] || currentUser.role;
    roleEl.className = 'user-chip__role ' + currentUser.role;
  }
}

// ================================================
//  CUSTOM CONFIRM DIALOG (replaces browser confirm())
// ================================================
function showConfirm({ icon = '🗑️', title = 'Konfirmasi', msg = '', okLabel = 'Ya, Hapus', okClass = 'btn--danger' } = {}) {
  return new Promise(resolve => {
    const dialog = document.getElementById('confirmDialog');
    document.getElementById('confirmIcon').textContent = icon;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    const okBtn = document.getElementById('confirmOkBtn');
    okBtn.textContent = okLabel;
    okBtn.className = 'btn ' + okClass;
    dialog.classList.remove('hidden');

    function cleanup(result) {
      dialog.classList.add('hidden');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      dialog.removeEventListener('click', onOverlay);
      resolve(result);
    }
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);
    const onOverlay = (e) => { if (e.target === dialog) cleanup(false); };
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    dialog.addEventListener('click', onOverlay);
  });
}

// ================================================
//  RECYCLE BIN
// ================================================
let recycleBin = [];

function loadRecycleBin() {
  try { recycleBin = JSON.parse(localStorage.getItem('fv_recycle') || '[]'); } catch { recycleBin = []; }
  // Auto-purge entries older than 30 days
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  recycleBin = recycleBin.filter(e => e.deletedAt > cutoff);

  // Re-attach node references from nodeMap
  recycleBin.forEach(e => {
    e.node = getNode(e.id);
  });
  // Filter out any entries that lost their node (permanently deleted from DB)
  recycleBin = recycleBin.filter(e => e.node);

  saveRecycleBin();
}

function saveRecycleBin() {
  // We only store lightweight metadata (no blobs) in localStorage
  const slim = recycleBin.map(e => ({
    id: e.id, name: e.name, type: e.type, path: e.path,
    deletedAt: e.deletedAt, deletedBy: e.deletedBy,
  }));
  localStorage.setItem('fv_recycle', JSON.stringify(slim));
  updateRecycleBinBadge();
}

function updateRecycleBinBadge() {
  const badge = document.getElementById('recycleBinCount');
  const sidebarBadge = document.getElementById('sidebarRecycleCount');
  const sidebarBtn = document.getElementById('sidebarRecycleBtn');
  const count = recycleBin.length;
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
  if (sidebarBadge) {
    sidebarBadge.textContent = count;
  }
  if (sidebarBtn) {
    if (count > 0) sidebarBtn.classList.add('has-items');
    else sidebarBtn.classList.remove('has-items');
  }
}

function softDeleteNodes(ids) {
  if (!canDelete()) { showToast('❌ Hanya Super Admin yang dapat menghapus file', 'error'); return; }
  ids.forEach(id => {
    const node = getNode(id);
    if (!node) return;
    // Add to recycle bin
    recycleBin.push({
      id: node.id, name: node.name, type: node.type, path: node.path,
      parentId: node.parent, node,
      deletedAt: Date.now(), deletedBy: currentUser.name,
    });
    // Remove from active tree but keep in memory/DB
    const parent = getNode(node.parent || 'root');
    if (parent) parent.children = parent.children.filter(c => c.id !== id);

    // Attach to recycle_bin root
    node.parent = 'recycle_bin';
    nodeMap['recycle_bin'].children.push(node);
    dbSaveNode(node);

    if (node.type === 'file') totalFiles--;
    else totalFiles -= countFiles(node);
  });
  saveRecycleBin();
  selectedIds.clear();
  lastClickedIdx = -1;
  closeDetail();
  showToast(`🗑️ ${ids.length} item dipindahkan ke Recycle Bin`, 'success');
  refreshUI();
}

function restoreNode(binEntry, targetParentId = null) {
  // Re-insert node back into its original parent (fall back to root)
  const parentId = targetParentId
    ? targetParentId
    : (nodeMap[binEntry.parentId] ? binEntry.parentId : 'root');
  const node = binEntry.node;
  node.parent = parentId;
  // Remove from recycle_bin tree
  const rbNode = nodeMap['recycle_bin'];
  if (rbNode) rbNode.children = rbNode.children.filter(c => c.id !== node.id);

  // Update path based on new parent
  const parentNode = getNode(parentId);
  node.path = parentNode && parentNode.path ? parentNode.path + '/' + node.name : node.name;
  nodeMap[node.id] = node;
  if (parentNode && !parentNode.children.find(c => c.id === node.id)) parentNode.children.push(node);
  if (node.type === 'file') totalFiles++;
  else totalFiles += countFiles(node);
  dbSaveNode(node);
  recycleBin = recycleBin.filter(e => e.id !== binEntry.id);
  saveRecycleBin();
  const destName = parentNode ? (parentNode.id === 'root' ? 'Home' : parentNode.name) : 'Home';
  showToast(`✅ "${node.name}" dipulihkan ke folder "${destName}"`, 'success');
  refreshUI();
  renderRecycleBinList();
}

// Pending recycle-bin restore: bin entry waiting for folder selection
let _pendingRestoreBinEntry = null;

function restoreNodeToFolder(binEntry) {
  _pendingRestoreBinEntry = binEntry;
  // Temporarily add node back to nodeMap so openMoveModal can exclude it if it's a folder
  const node = binEntry.node;
  const excludeIds = node.type === 'folder' ? [node.id] : [];

  // Build the folder picker (re-use openMoveModal internals)
  moveTargetIds = [];
  moveSelectedFolderId = null;
  moveFolderTree.innerHTML = '';
  moveFolderTree._moveExpandMap = {};
  if (moveConfirmBtn) moveConfirmBtn.disabled = true;

  // Update modal title to reflect restore context
  const titleEl = document.getElementById('moveModalTitle');
  if (titleEl) titleEl.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
    Kembalikan ke Folder`;

  // Build home/root row
  const homeRow = document.createElement('div');
  homeRow.className = 'move-tree-node';
  const rootItem = document.createElement('div');
  rootItem.className = 'move-tree-item';
  rootItem.style.paddingLeft = '8px';
  rootItem.dataset.id = 'root';
  const rootHasSubs = repoRoot.children.some(c => c.type === 'folder' && !excludeIds.includes(c.id));
  const rootIsExp = true;
  rootItem.innerHTML = `
    <span class="move-tree-arrow ${rootHasSubs ? '' : 'hidden'} open">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 2 8 6 4 10"/></svg>
    </span>
    <svg viewBox="0 0 20 20" fill="none" class="move-tree-icon">
      <path d="M10 3L2 9h3v8h4v-5h2v5h4V9h3L10 3z" fill="#0066B3" fill-opacity="0.3" stroke="#0066B3" stroke-width="1.2"/>
    </svg>
    <span class="move-tree-label">🏠 Home (root)</span>`;

  const rootChildrenWrap = document.createElement('div');
  rootChildrenWrap.className = 'move-tree-children';
  rootChildrenWrap._moveExpandMap = moveFolderTree._moveExpandMap;

  const homeArrow = rootItem.querySelector('.move-tree-arrow');
  if (homeArrow && rootHasSubs) {
    homeArrow.addEventListener('click', e => {
      e.stopPropagation();
      const nowExp = moveFolderTree._moveExpandMap['root'] !== false;
      moveFolderTree._moveExpandMap['root'] = !nowExp;
      rootChildrenWrap.style.display = moveFolderTree._moveExpandMap['root'] === false ? 'none' : '';
      homeArrow.classList.toggle('open', moveFolderTree._moveExpandMap['root'] !== false);
    });
  }

  rootItem.addEventListener('click', e => {
    if (e.target.closest('.move-tree-arrow')) return;
    moveFolderTree.querySelectorAll('.move-tree-item.selected').forEach(el => el.classList.remove('selected'));
    rootItem.classList.add('selected');
    moveSelectedFolderId = 'root';
    if (moveConfirmBtn) moveConfirmBtn.disabled = false;
  });

  buildMoveFolderTree(rootChildrenWrap, repoRoot, excludeIds, 1);
  homeRow.appendChild(rootItem);
  homeRow.appendChild(rootChildrenWrap);
  moveFolderTree.appendChild(homeRow);

  moveModal.classList.remove('hidden');
}

function permanentDeleteFromBin(binEntry) {
  if (!canDelete()) { showToast('❌ Hanya Super Admin yang dapat menghapus permanen', 'error'); return; }
  recycleBin = recycleBin.filter(e => e.id !== binEntry.id);
  saveRecycleBin();
  dbDeleteSubtree(binEntry.node);
  // Clean up from nodeMap memory
  function removeMap(n) { delete nodeMap[n.id]; n.children.forEach(removeMap); }
  if (binEntry.node) removeMap(binEntry.node);

  showToast('🗑️ File dihapus permanen', 'success');
  renderRecycleBinList();
}

function renderRecycleBinList() {
  const list = document.getElementById('recycleBinList');
  if (!list) return;
  if (!recycleBin.length) {
    list.innerHTML = '<div class="recycle-empty">Recycle Bin kosong</div>';
    return;
  }
  list.innerHTML = '';
  recycleBin.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'recycle-item';
    const days = Math.ceil((Date.now() - entry.deletedAt) / (1000 * 60 * 60 * 24));
    const remaining = 30 - days;
    const remainingColor = remaining <= 3 ? 'color:#ff6b6b' : remaining <= 7 ? 'color:#ffd93d' : '';
    item.innerHTML = `
      <span class="recycle-item__icon">${entry.type === 'folder' ? buildFolderIcon(32) : buildFileIcon(entry.name, 32)}</span>
      <span class="recycle-item__info">
        <div class="recycle-item__name">${escapeHtml(entry.name)}</div>
        <div class="recycle-item__meta">Dihapus oleh <strong>${escapeHtml(entry.deletedBy)}</strong> · <span style="${remainingColor}">${remaining} hari tersisa</span></div>
      </span>
      <div class="recycle-item__btns">
        <button class="btn btn--primary sel-btn" data-restore="${entry.id}" title="Pulihkan ke folder asal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;vertical-align:middle;margin-right:3px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          Pulihkan
        </button>
        ${canDelete() ? `<button class="btn btn--danger sel-btn" data-perm="${entry.id}">Hapus</button>` : ''}
      </div>
    `;
    item.querySelector('[data-restore]').addEventListener('click', () => restoreNode(entry));
    const permBtn = item.querySelector('[data-perm]');
    if (permBtn) permBtn.addEventListener('click', () => permanentDeleteFromBin(entry));
    list.appendChild(item);
  });
}

function newId() { return 'n' + (++nodeIdSeq); }

// ================================================
//  INDEXEDDB — SIMPLE PERSISTENCE LAYER
// ================================================
const DB_NAME = 'FileVaultDB';
const DB_VERSION = 1;
let idb = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('nodes')) {
        const store = d.createObjectStore('nodes', { keyPath: 'id' });
        store.createIndex('parent', 'parent', { unique: false });
      }
    };
    req.onsuccess = e => { idb = e.target.result; resolve(idb); };
    req.onerror = e => reject(e.target.error);
  });
}

function dbRun(mode, fn) {
  if (!idb) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('nodes', mode);
    tx.onerror = e => reject(e.target.error);
    resolve(fn(tx.objectStore('nodes')));
  });
}

function dbSaveNode(node) {
  const record = {
    id: node.id,
    name: node.name,
    type: node.type,
    path: node.path,
    parent: node.parent,
    fileBlob: node.file || null,
    fileName: node.file ? node.file.name : null,
    fileLastModified: node.file ? node.file.lastModified : null,
  };
  return dbRun('readwrite', store => store.put(record));
}

function dbDeleteNode(id) {
  return dbRun('readwrite', store => store.delete(id));
}

function dbDeleteSubtree(node) {
  // delete node + all descendants
  const all = [];
  const collect = n => { all.push(n.id); n.children.forEach(collect); };
  collect(node);
  return dbRun('readwrite', store => all.forEach(id => store.delete(id)));
}

function dbClearAll() {
  return dbRun('readwrite', store => store.clear());
}

function dbGetAll() {
  return new Promise((resolve, reject) => {
    if (!idb) return resolve([]);
    const tx = idb.transaction('nodes', 'readonly');
    const req = tx.objectStore('nodes').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function restoreFromDB() {
  setDbStatus('loading', '⏳ Memuat…');
  try {
    const records = await dbGetAll();
    if (!records.length) { setDbStatus('connected', '💾 DB kosong'); return; }

    // Track max ID seq for collision safety
    let maxSeq = nodeIdSeq;

    // First pass — create all node shells
    records.forEach(rec => {
      if (rec.id === 'root' || rec.id === 'recycle_bin') return;
      const seq = parseInt(rec.id.replace('n', ''), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;

      // Reconstruct File from stored Blob (File extends Blob; IDB may strip type)
      let file = null;
      if (rec.fileBlob) {
        if (rec.fileBlob instanceof File) {
          file = rec.fileBlob;
        } else {
          file = new File([rec.fileBlob], rec.fileName || rec.name, {
            lastModified: rec.fileLastModified || Date.now(),
          });
        }
      }
      const node = {
        id: rec.id, name: rec.name, type: rec.type,
        path: rec.path, parent: rec.parent, children: [], file,
        // Restore metadata – keep whatever was saved, fallback to sensible defaults
        createdBy: rec.createdBy || 'Unknown',
        createdAt: rec.createdAt || null,
        modifiedBy: rec.modifiedBy || rec.createdBy || 'Unknown',
        modifiedAt: rec.modifiedAt || rec.createdAt || null,
      };
      nodeMap[rec.id] = node;
      if (rec.type === 'file') totalFiles++;
    });

    nodeIdSeq = maxSeq;

    // Second pass — wire parent → children
    Object.values(nodeMap).forEach(node => {
      if (node.id === 'root') return;
      const parent = nodeMap[node.parent];
      if (parent) parent.children.push(node);
    });

    setDbStatus('connected', `💾 ${totalFiles} file dimuat`);
    refreshUI();
    showToast(`✅ Berhasil memuat ${totalFiles} file dari database`, 'success');
  } catch (err) {
    console.error('DB restore error:', err);
    setDbStatus('error', '❌ DB error');
  }
}

function setDbStatus(cls, text) {
  const el = document.getElementById('dbStatus');
  if (!el) return;
  el.className = 'db-status ' + cls;
  el.textContent = text;
}

// Boot: open DB then restore
openDB()
  .then(() => {
    setDbStatus('connected', '💾 DB OK');
    return restoreFromDB();
  })
  .then(() => {
    // Load recycle bin after DB is restored so nodes are matched
    loadRecycleBin();
  })
  .catch(err => {
    console.error('DB open error:', err);
    setDbStatus('error', '❌ DB gagal');
  });

// ================================================
//  NODE OPERATIONS
// ================================================
function insertNode(parentId, name, type, file = null) {
  const parent = nodeMap[parentId];
  if (!parent) return null;

  // Deduplicate folder names
  const existing = parent.children.find(c => c.name === name && c.type === type);
  if (existing && type === 'folder') return existing.id;

  const id = newId();
  const path = parent.path ? parent.path + '/' + name : name;
  const now = Date.now();
  const node = {
    id, name, type, path, children: [], file, parent: parentId,
    createdBy: currentUser.name, createdAt: now,
    modifiedBy: currentUser.name, modifiedAt: now,
  };
  nodeMap[id] = node;
  parent.children.push(node);
  if (type === 'file') totalFiles++;

  // Persist to IndexedDB
  dbSaveNode(node);
  return id;
}

function getNode(id) { return nodeMap[id] || null; }

function findChildren(parentId) {
  const p = nodeMap[parentId];
  return p ? p.children : [];
}

// ================================================
//  PROCESS DROPPED ITEMS
// ================================================
async function processDataTransfer(dataTransfer) {
  const items = [...dataTransfer.items];
  const entries = items
    .filter(i => i.kind === 'file')
    .map(i => i.webkitGetAsEntry ? i.webkitGetAsEntry() : null)
    .filter(Boolean);

  if (!entries.length) {
    showToast('Tidak ada file/folder yang terdeteksi', 'error');
    return;
  }

  showToast('Memuat…');
  let added = 0;
  for (const entry of entries) {
    added += await traverseEntry(entry, 'root');
  }
  showToast(`✅ ${added} item berhasil ditambahkan`, 'success');
  refreshUI();
}

async function traverseEntry(entry, parentId) {
  if (!entry) return 0;
  let count = 0;
  if (entry.isDirectory) {
    const folderId = insertNode(parentId, entry.name, 'folder');
    const reader = entry.createReader();
    const readAll = () => new Promise((res, rej) => {
      const results = [];
      const readBatch = () => reader.readEntries(batch => {
        if (batch.length === 0) return res(results);
        results.push(...batch);
        readBatch();
      }, rej);
      readBatch();
    });
    const children = await readAll();
    for (const child of children) {
      count += await traverseEntry(child, folderId);
    }
    count++;
  } else {
    const file = await new Promise((res, rej) => entry.file(res, rej));
    const validation = validateFile(file);
    if (!validation.ok) {
      showToast(`⛔ "${file.name}" ditolak: ${validation.reason}`, 'error');
      return 0;
    }
    insertNode(parentId, entry.name, 'file', file);
    count++;
  }
  return count;
}

// Fallback for <input type="file" webkitdirectory>
function processFolderInput(input) {
  const files = [...input.files];
  if (!files.length) return;
  if (files.length > MAX_FILES_PER_UPLOAD) {
    showToast(`⛔ Maksimal ${MAX_FILES_PER_UPLOAD} file per upload (dipilih: ${files.length})`, 'error');
    input.value = '';
    return;
  }
  let added = 0;
  const rejected = [];
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.ok) { rejected.push(`${file.name}: ${validation.reason}`); continue; }
    const parts = (file.webkitRelativePath || file.name).split('/');
    let parentId = 'root';
    for (let i = 0; i < parts.length - 1; i++) {
      parentId = insertNode(parentId, parts[i], 'folder') || parentId;
    }
    const fileName = parts[parts.length - 1];
    if (fileName) { insertNode(parentId, fileName, 'file', file); added++; }
  }
  input.value = '';
  if (rejected.length) showToast(`⛔ ${rejected.length} file ditolak (format/ukuran tidak sesuai)`, 'error');
  if (added) showToast(`✅ ${added} file berhasil ditambahkan`, 'success');
  refreshUI();
}


// ================================================
//  SEARCH
// ================================================
function searchFiles(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null; // null = show normal
  const results = [];
  function walk(node) {
    if (node.type === 'file') {
      if (node.name.toLowerCase().includes(q) || getExt(node.name).includes(q)) {
        results.push(node);
      }
    } else {
      for (const child of node.children) walk(child);
    }
  }
  walk(repoRoot);
  return results;
}

// ================================================
//  RENDER TREE
// ================================================
const treeContainer = document.getElementById('treeContainer');
const treeExpandMap = {}; // id -> boolean expanded

function renderTree() {
  const hasFolders = repoRoot.children.length > 0;
  if (!hasFolders) {
    treeContainer.innerHTML = `<div class="tree-empty">
      <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#E5F0FA"/><path d="M20 28h12l4 4h8v14H20V28z" fill="#0066B3" fill-opacity="0.4"/><path d="M20 28h12l4 4h8v14H20V28z" stroke="#0066B3" stroke-width="1.5"/></svg>
      <p>Belum ada folder.<br/>Drag & drop di sini.</p>
    </div>`;
    return;
  }
  treeContainer.innerHTML = '';
  // "Home / All" row
  const homeRow = document.createElement('div');
  homeRow.className = 'tree-node__row' + (currentPath === '' ? ' active' : '');
  homeRow.innerHTML = `<span class="tree-node__arrow hidden"></span>
    <span class="tree-node__icon">${buildFolderIcon(16)}</span>
    <span class="tree-node__name">🏠 Home</span>
    <span class="tree-node__count">${totalFiles}</span>`;
  homeRow.addEventListener('click', () => navigate(''));
  treeContainer.appendChild(homeRow);

  for (const child of repoRoot.children) {
    if (child.type === 'folder') treeContainer.appendChild(buildTreeNode(child, 0));
  }
}

function buildTreeNode(node, depth) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tree-node';

  const hasFolderChildren = node.children.some(c => c.type === 'folder');
  const isExpanded = treeExpandMap[node.id] !== false; // default expanded
  const isActive = currentPath === node.id;

  const row = document.createElement('div');
  row.className = 'tree-node__row' + (isActive ? ' active' : '');
  row.style.paddingLeft = (8 + depth * 12) + 'px';

  const fileCount = countFiles(node);
  row.innerHTML = `
    <span class="tree-node__arrow ${isExpanded ? 'open' : ''} ${!hasFolderChildren ? 'hidden' : ''}">
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 2 8 6 4 10"/></svg>
    </span>
    <span class="tree-node__icon">${buildFolderIcon(16, isExpanded)}</span>
    <span class="tree-node__name" title="${node.name}">${node.name}</span>
    <span class="tree-node__count">${fileCount}</span>
  `;

  const childrenWrap = document.createElement('div');
  childrenWrap.className = 'tree-node__children' + (isExpanded ? '' : ' collapsed');
  childrenWrap.style.maxHeight = isExpanded ? '9999px' : '0';

  // Click on arrow: only toggle expand/collapse (don't navigate)
  const arrowEl = row.querySelector('.tree-node__arrow');
  if (arrowEl && hasFolderChildren) {
    arrowEl.addEventListener('click', e => {
      e.stopPropagation();
      treeExpandMap[node.id] = !isExpanded;
      renderTree();
    });
  }

  // Click on row (but not arrow): navigate only
  row.addEventListener('click', e => {
    e.stopPropagation();
    navigate(node.id);
  });

  // Right-click on tree node → context menu
  row.addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY, node);
  });

  // Double-click on tree node name → inline rename
  row.addEventListener('dblclick', e => {
    e.stopPropagation();
    const nameEl = row.querySelector('.tree-node__name');
    if (!nameEl) return;
    startInlineRename(nameEl, node);
  });

  for (const child of node.children) {
    if (child.type === 'folder') {
      childrenWrap.appendChild(buildTreeNode(child, depth + 1));
    }
  }

  wrapper.appendChild(row);
  wrapper.appendChild(childrenWrap);
  return wrapper;
}

function countFiles(node) {
  let n = 0;
  for (const c of node.children) {
    if (c.type === 'file') n++;
    else n += countFiles(c);
  }
  return n;
}

// ================================================
//  RENDER FILES (grid / list)
// ================================================
const dropZone = document.getElementById('dropZone');
const fileContainer = document.getElementById('fileContainer');
const fileGrid = document.getElementById('fileGrid');
const emptySearch = document.getElementById('emptySearch');
const searchTermEl = document.getElementById('searchTerm');
const breadcrumb = document.getElementById('breadcrumb');

function renderFiles() {
  const searchResults = searchFiles(currentSearchQuery);
  let items;

  if (searchResults !== null) {
    // SEARCH MODE: show all matching files from whole repo
    fileGrid.innerHTML = '';
    emptySearch.classList.add('hidden');
    let filtered = searchResults;
    // View-only: filter to only files inside accessible folders
    if (isViewOnly() && currentUser.officeId) {
      filtered = searchResults.filter(node => {
        let cur = node.parent ? getNode(node.parent) : null;
        while (cur && cur.id !== 'root') {
          if (isSharedWithOffice(cur.id, currentUser.officeId)) return true;
          cur = cur.parent ? getNode(cur.parent) : null;
        }
        return false;
      });
    }
    if (filtered.length === 0) {
      searchTermEl.textContent = currentSearchQuery;
      dropZone.classList.add('hidden');
      fileContainer.classList.add('hidden');
      emptySearch.classList.remove('hidden');
      return;
    }
    items = filtered;
    dropZone.classList.add('hidden');
    fileContainer.classList.remove('hidden');
    items.forEach((node, i) => {
      fileGrid.appendChild(buildFileCard(node, i));
    });
    return;
  }

  // NORMAL MODE
  emptySearch.classList.add('hidden');

  // View-only mode: show shared folders even if totalFiles == 0
  if (isViewOnly() && currentUser.officeId) {
    dropZone.classList.add('hidden');
    fileContainer.classList.remove('hidden');
    fileGrid.innerHTML = '';
    const parent = currentPath ? getNode(currentPath) : repoRoot;
    if (!parent) return;

    // Filter children: only show folders accessible to this office
    const accessible = parent.children.filter(node => {
      if (node.type === 'folder') return officeCanAccessNode(node.id, currentUser.officeId);
      // Show files only if current folder is directly shared
      if (node.type === 'file' && currentPath) return officeCanAccessNode(currentPath, currentUser.officeId);
      return false;
    });
    if (accessible.length === 0) {
      fileGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">Tidak ada folder yang dibagikan ke kantor Anda</div>`;
      return;
    }
    renderedNodes = accessible;
    accessible.forEach((node, i) => fileGrid.appendChild(buildFileCard(node, i)));
    return;
  }

  const hasFiles = totalFiles > 0;
  if (!hasFiles) {
    dropZone.classList.remove('hidden');
    fileContainer.classList.add('hidden');
    return;
  }
  dropZone.classList.add('hidden');
  fileContainer.classList.remove('hidden');

  fileGrid.innerHTML = '';
  const parent = currentPath ? getNode(currentPath) : repoRoot;
  if (!parent) return;

  const children = parent.children;
  if (children.length === 0) {
    fileGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">Folder ini kosong</div>`;
    return;
  }

  // Sort: folders first, then files, then apply currentSortMode
  const sorted = [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;

    if (currentSortMode === 'name_asc') {
      return a.name.localeCompare(b.name);
    } else if (currentSortMode === 'name_desc') {
      return b.name.localeCompare(a.name);
    } else if (currentSortMode === 'date_desc') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    } else if (currentSortMode === 'date_asc') {
      return (a.createdAt || 0) - (b.createdAt || 0);
    }
    return 0;
  });

  renderedNodes = sorted;
  sorted.forEach((node, i) => {
    fileGrid.appendChild(buildFileCard(node, i));
  });
}

// Helper: is this node a media file?
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']);
function isImage(name) { return IMAGE_EXTS.has(getExt(name)); }
function isVideo(name) { return VIDEO_EXTS.has(getExt(name)); }
function isMedia(name) { return isImage(name) || isVideo(name); }

// Sorted list of rendered nodes (for range-select)
let renderedNodes = [];

// Track object URLs by node id to revoke on refresh (memory leak prevention)
const _objectUrls = {};
function revokeCardUrls() {
  Object.keys(_objectUrls).forEach(id => {
    URL.revokeObjectURL(_objectUrls[id]);
    delete _objectUrls[id];
  });
}

function buildFileCard(node, idx) {
  const isSelected = selectedIds.has(node.id);
  const card = document.createElement('div');
  const ext = getExt(node.name);
  const isImg = ALLOWED_PHOTO_EXTS.has(ext);
  const isVid = ALLOWED_VIDEO_EXTS.has(ext);
  const hasFile = node.type === 'file' && node.file;
  const mediaClass = (node.type === 'file' && isMedia(node.name)) ? ' media-file' : '';
  const thumbClass = (hasFile && (isImg || isVid)) ? ' has-thumb' : '';

  // Shared folder visual classes
  let sharedClass = '';
  let shareBadgeHtml = '';
  if (node.type === 'folder') {
    if (isFolderShared(node.id)) {
      sharedClass = ' folder-shared';
      const activeShares = getActiveShares(node.id);
      const daysLeft = activeShares.length > 0
        ? Math.ceil((Math.min(...activeShares.map(s => s.expiredAt)) - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      const shareCount = activeShares.length;
      shareBadgeHtml = `<span class="share-badge share-badge--active" title="Dibagikan ke ${shareCount} kantor · ${daysLeft} hari tersisa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        ${shareCount}
      </span>`;
    } else if (isFolderExpiredShare(node.id)) {
      sharedClass = ' folder-expired';
      shareBadgeHtml = `<span class="share-badge share-badge--expired" title="Sharing telah berakhir">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Expired
      </span>`;
    }
  }

  card.className = 'file-card' + (isSelected ? ' selected' : '') + mediaClass + thumbClass + sharedClass;
  card.style.animationDelay = Math.min(idx * 30, 300) + 'ms';
  card.dataset.id = node.id;
  card.dataset.idx = idx;

  let iconHtml, meta, badgeHtml = '', thumbHtml = '';

  if (node.type === 'folder') {
    iconHtml = buildFolderIcon(48, false, sharedClass !== '');
    meta = `${node.children.length} item`;
  } else {
    const info = getFileInfo(node.name);
    meta = hasFile ? formatSize(node.file.size) : '';
    badgeHtml = `<span class="file-card__badge" style="background:${info.color}22;color:${info.color}">${info.label}</span>`;

    if (hasFile && isImg) {
      // Reuse existing objectURL if we have one, otherwise create
      if (!_objectUrls[node.id]) {
        _objectUrls[node.id] = URL.createObjectURL(node.file);
      }
      thumbHtml = `<span class="file-card__thumb"><img src="${_objectUrls[node.id]}" alt="${escapeHtml(node.name)}" loading="lazy" /></span>`;
      iconHtml = ''; // thumbnail replaces icon
    } else if (hasFile && isVid) {
      if (!_objectUrls[node.id]) {
        _objectUrls[node.id] = URL.createObjectURL(node.file);
      }
      thumbHtml = `<span class="file-card__thumb file-card__thumb--video">
        <video src="${_objectUrls[node.id]}" preload="metadata" muted playsinline></video>
        <span class="thumb-play-icon"><svg viewBox="0 0 16 16" fill="white"><polygon points="3 1 14 8 3 15"/></svg></span>
      </span>`;
      iconHtml = ''; // thumbnail replaces icon
    } else {
      iconHtml = buildFileIcon(node.name, 48);
    }
  }

  const displayName = highlightMatch(escapeHtml(node.name), currentSearchQuery);

  // Checkbox HTML
  const checkHtml = `<span class="file-card__checkbox" tabindex="-1">
    <svg viewBox="0 0 12 10" fill="none"><polyline points="1 5 4.5 9 11 1"/></svg>
  </span>`;

  // Build card content
  if (viewMode === 'list') {
    const listIcon = iconHtml || `<span class="file-card__thumb-sm">${thumbHtml}</span>`;
    card.innerHTML = `${checkHtml}${shareBadgeHtml}<span class="file-card__icon">${listIcon}</span><span class="file-card__name">${displayName}</span><span class="file-card__meta">${meta}</span>${badgeHtml}`;
  } else {
    if (thumbHtml) {
      // Grid with thumbnail: thumb on top, name below
      card.innerHTML = `${checkHtml}${badgeHtml}${shareBadgeHtml}${thumbHtml}<span class="file-card__name">${displayName}</span><span class="file-card__meta">${meta}</span>`;
    } else {
      card.innerHTML = `${checkHtml}${badgeHtml}<span class="file-card__icon">${iconHtml}</span><span class="file-card__name">${displayName}</span><span class="file-card__meta">${meta}</span>`;
    }
  }

  // Seek video to 1s to get a proper thumbnail frame
  if (hasFile && isVid) {
    const vid = card.querySelector('video');
    if (vid) {
      vid.addEventListener('loadedmetadata', () => {
        vid.currentTime = Math.min(1, vid.duration || 0);
      }, { once: true });

      // YouTube-style: hover to play, leave to pause & reset
      card.addEventListener('mouseenter', () => {
        vid.muted = true;
        vid.playbackRate = 1;
        vid.play().catch(() => { });
      });
      card.addEventListener('mouseleave', () => {
        vid.pause();
        vid.currentTime = Math.min(1, vid.duration || 0);
      });
    }
  }

  // Checkbox click — toggle selection only (no open/navigate)
  const cb = card.querySelector('.file-card__checkbox');
  cb.addEventListener('click', e => {
    e.stopPropagation();
    toggleSelect(node.id, idx, e);
  });

  // Card click
  card.addEventListener('click', e => {
    if (node.type === 'folder') {
      if (e.ctrlKey || e.metaKey || e.shiftKey || selectedIds.size > 0) {
        toggleSelect(node.id, idx, e);
      } else {
        navigate(node.id);
      }
    } else {
      if (e.ctrlKey || e.metaKey) {
        toggleSelect(node.id, idx, e);
      } else if (e.shiftKey) {
        rangeSelect(idx);
      } else if (isMedia(node.name) && node.file) {
        selectedIds.clear();
        selectedIds.add(node.id);
        lastClickedIdx = idx;
        updateSelectionBar();
        openLightbox(node);
      } else {
        selectedIds.clear();
        selectedIds.add(node.id);
        lastClickedIdx = idx;
        updateSelectionBar();
        renderFileClasses();
        showDetail(node);
        appLayout.classList.add('detail-open');
      }
    }
  });

  // Right-click context menu (folders & files)
  card.addEventListener('contextmenu', e => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, node);
  });
  if (node.type === 'folder') {
    card.addEventListener('dblclick', e => {
      e.stopPropagation();
      openRenameModal(node.id);
    });
  }

  return card;
}


function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ================================================
//  MULTI-SELECT HELPERS
// ================================================
function renderFileClasses() {
  document.querySelectorAll('.file-card').forEach(card => {
    const id = card.dataset.id;
    card.classList.toggle('selected', selectedIds.has(id));
  });
  updateSelectAllCheckbox();
  updateFolderItemCount();
}

// ── Select All ──────────────────────────────────
function selectAllVisible() {
  if (!renderedNodes.length) return;
  const allIds = renderedNodes.map(n => n.id);
  const allSelected = allIds.every(id => selectedIds.has(id));
  if (allSelected) {
    allIds.forEach(id => selectedIds.delete(id));
  } else {
    allIds.forEach(id => selectedIds.add(id));
  }
  updateSelectionBar();
  renderFileClasses();
}

function updateSelectAllCheckbox() {
  const chk = document.getElementById('selectAllChk');
  if (!chk) return;
  const allIds = renderedNodes.map(n => n.id);
  if (!allIds.length) { chk.checked = false; chk.indeterminate = false; return; }
  const selCount = allIds.filter(id => selectedIds.has(id)).length;
  if (selCount === 0) { chk.checked = false; chk.indeterminate = false; }
  else if (selCount === allIds.length) { chk.checked = true; chk.indeterminate = false; }
  else { chk.checked = false; chk.indeterminate = true; }
}

function updateFolderItemCount() {
  const el = document.getElementById('folderItemCount');
  if (!el) return;
  const n = renderedNodes.length;
  if (!n) { el.textContent = ''; return; }
  const folders = renderedNodes.filter(x => x.type === 'folder').length;
  const files = n - folders;
  const parts = [];
  if (folders) parts.push(`${folders} folder`);
  if (files) parts.push(`${files} file`);
  el.textContent = parts.join(', ');
}

// Wire select-all checkbox after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const chk = document.getElementById('selectAllChk');
  if (chk) chk.addEventListener('change', selectAllVisible);
});
// Also wire immediately in case DOMContentLoaded already fired
(function wireSelectAll() {
  const chk = document.getElementById('selectAllChk');
  if (chk) { chk.addEventListener('change', selectAllVisible); return; }
  requestAnimationFrame(wireSelectAll);
})();

function toggleSelect(nodeId, idx, e) {
  if (e && e.shiftKey && lastClickedIdx >= 0) {
    rangeSelect(idx);
  } else {
    if (selectedIds.has(nodeId)) { selectedIds.delete(nodeId); }
    else { selectedIds.add(nodeId); }
    lastClickedIdx = idx;
  }
  updateSelectionBar();
  renderFileClasses();
}

function rangeSelect(toIdx) {
  const from = Math.min(lastClickedIdx, toIdx);
  const to = Math.max(lastClickedIdx, toIdx);
  renderedNodes.slice(from, to + 1).forEach(n => selectedIds.add(n.id));
  updateSelectionBar();
  renderFileClasses();
}

function clearSelection() {
  selectedIds.clear();
  lastClickedIdx = -1;
  updateSelectionBar();
  renderFileClasses();
  closeDetail();
}

function highlightMatch(escapedName, query) {
  if (!query) return escapedName;
  const re = new RegExp('(' + escapeRegex(query) + ')', 'gi');
  return escapedName.replace(re, '<span class="highlight">$1</span>');
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

// ================================================
//  NAVIGATION
// ================================================
function navigate(nodeId) {
  currentPath = nodeId;
  selectedIds.clear();
  lastClickedIdx = -1;
  closeDetail();
  updateBreadcrumb();
  renderTree();
  renderFiles();
}

function updateBreadcrumb() {
  breadcrumb.innerHTML = `<span class="bc-item bc-home" data-path="">🏠 Home</span>`;
  document.querySelector('.bc-home').addEventListener('click', () => navigate(''));

  if (!currentPath) return;

  const crumbs = [];
  let node = getNode(currentPath);
  while (node && node.id !== 'root') {
    crumbs.unshift(node);
    node = getNode(node.parent);
  }

  crumbs.forEach((cr, i) => {
    const sep = document.createElement('span');
    sep.className = 'bc-sep'; sep.textContent = '/';
    breadcrumb.appendChild(sep);
    const item = document.createElement('span');
    item.className = 'bc-item';
    item.textContent = cr.name;
    if (i < crumbs.length - 1) {
      item.addEventListener('click', () => navigate(cr.id));
    }
    breadcrumb.appendChild(item);
  });
}

// ================================================
//  DETAIL PANEL
// ================================================
const detailPanel = document.getElementById('detailPanel');
const detailContent = document.getElementById('detailContent');
const appLayout = document.querySelector('.app-layout');

function selectFile(node) {
  selectedIds.clear();
  selectedIds.add(node.id);
  updateSelectionBar();
  renderFiles();
  showDetail(node);
}

function showDetail(node) {
  appLayout.classList.add('detail-open');
  const file = node.file;
  const ext = getExt(node.name);
  const isFolder = node.type === 'folder';
  const fmtDate = ts => ts ? new Date(ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  // --- Preview (image only) ---
  let previewHtml = '';
  const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  if (!isFolder && isImg && file) {
    const url = URL.createObjectURL(file);
    previewHtml = `<div class="detail-preview"><img src="${url}" alt="${escapeHtml(node.name)}" /></div>`;
  }

  // --- Folder stats ---
  let folderStatsHtml = '';
  if (isFolder) {
    let totalSize = 0, fileCount = 0, subfolderCount = 0;
    const walkFolder = (n) => {
      n.children.forEach(c => {
        if (c.type === 'file') { fileCount++; if (c.file) totalSize += c.file.size; }
        else if (c.type === 'folder') { subfolderCount++; walkFolder(c); }
      });
    };
    walkFolder(node);
    folderStatsHtml = `
      <div class="detail-section-title">Isi Folder</div>
      <div class="detail-prop">
        <span class="detail-prop__label">📄 Jumlah File</span>
        <span class="detail-prop__value">${fileCount} file</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">📁 Sub-folder</span>
        <span class="detail-prop__value">${subfolderCount} folder</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">💾 Total Ukuran</span>
        <span class="detail-prop__value">${formatSize(totalSize)}</span>
      </div>`;
  }

  // --- File type label ---
  const typeLabel = isFolder
    ? 'Folder'
    : (file ? (file.type || `.${ext.toUpperCase()}`) : (ext ? `.${ext.toUpperCase()} File` : 'File'));

  // --- Icon ---
  const iconHtml = isFolder
    ? `<svg viewBox="0 0 64 64" width="72" height="72" fill="none"><rect x="4" y="18" width="56" height="38" rx="6" fill="#0066B3" fill-opacity="0.18" stroke="#0066B3" stroke-width="2"/><path d="M4 24h56" stroke="#0066B3" stroke-width="2"/><path d="M4 24V14a4 4 0 014-4h16l6 6h22a4 4 0 014 4v4" fill="#0066B3" fill-opacity="0.3" stroke="#0066B3" stroke-width="2"/></svg>`
    : buildFileIcon(node.name, 72);

  detailContent.innerHTML = `
    ${previewHtml}
    <div class="detail-icon">${iconHtml}</div>
    <div class="detail-title">${escapeHtml(node.name)}</div>
    <div class="detail-type">${typeLabel}</div>

    <div class="detail-section-title">Informasi Umum</div>
    <div class="detail-props">
      <div class="detail-prop">
        <span class="detail-prop__label">🏷️ Nama</span>
        <span class="detail-prop__value">${escapeHtml(node.name)}</span>
      </div>
      ${!isFolder ? `
      <div class="detail-prop">
        <span class="detail-prop__label">📋 Format</span>
        <span class="detail-prop__value">${file ? (file.type || `.${ext.toUpperCase()}`) : (ext ? ext.toUpperCase() : '—')}</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">💾 Ukuran</span>
        <span class="detail-prop__value">${file ? formatSize(file.size) : '—'}</span>
      </div>` : ''}
      <div class="detail-prop">
        <span class="detail-prop__label">📂 Lokasi</span>
        <span class="detail-prop__value detail-prop__value--path">${node.path ? '/' + escapeHtml(node.path) : '/ (root)'}</span>
      </div>
    </div>

    ${folderStatsHtml}

    <div class="detail-section-title">Riwayat</div>
    <div class="detail-props">
      <div class="detail-prop">
        <span class="detail-prop__label">👤 Dibuat oleh</span>
        <span class="detail-prop__value detail-prop__value--user">${escapeHtml(node.createdBy || '—')}</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">📅 Tanggal Dibuat</span>
        <span class="detail-prop__value">${fmtDate(node.createdAt)}</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">✏️ Dimodifikasi oleh</span>
        <span class="detail-prop__value detail-prop__value--user">${escapeHtml(node.modifiedBy || '—')}</span>
      </div>
      <div class="detail-prop">
        <span class="detail-prop__label">🕐 Terakhir Diubah</span>
        <span class="detail-prop__value">${fmtDate(node.modifiedAt)}</span>
      </div>
    </div>
  `;
}

function closeDetail() {
  appLayout.classList.remove('detail-open');
}

document.getElementById('detailClose').addEventListener('click', () => {
  closeDetail();
  renderFiles();
});

// ================================================
//  REFRESH UI
// ================================================
/* ── Storage widget ──────────────────────────────── */
const STORAGE_TOTAL_TB = 50;

function calcTotalSizeBytes() {
  // Sum all file sizes in the repository recursively
  let total = 0;
  function walk(node) {
    if (node.type === 'file') {
      total += (node.size || 0);
    } else if (node.children) {
      node.children.forEach(walk);
    }
  }
  repoRoot.children.forEach(walk);
  return total;
}

function formatStorageUsed(bytes) {
  const tb = bytes / (1024 ** 4);
  const gb = bytes / (1024 ** 3);
  const mb = bytes / (1024 ** 2);
  if (tb >= 0.5) return tb.toFixed(2) + ' TB';
  if (gb >= 1) return gb.toFixed(1) + ' GB';
  return mb.toFixed(0) + ' MB';
}

function updateStorageWidget() {
  const fill = document.getElementById('storageFill');
  const pct = document.getElementById('storagePct');
  const usedEl = document.getElementById('storageUsed');
  const widget = document.getElementById('storageWidget');
  if (!fill || !pct || !usedEl) return;

  const usedBytes = calcTotalSizeBytes();
  const usedTB = usedBytes / (1024 ** 4);
  const ratio = Math.min(usedTB / STORAGE_TOTAL_TB, 1);
  const pctVal = Math.round(ratio * 100);

  // Colour thresholds
  let color = '#059669'; // green < 70%
  if (pctVal >= 90) color = '#DC2626';      // red
  else if (pctVal >= 70) color = '#D97706'; // amber

  widget.style.setProperty('--storage-color', color);
  fill.style.width = pctVal + '%';
  pct.textContent = pctVal + '%';
  usedEl.textContent = formatStorageUsed(usedBytes);
}

function refreshUI() {
  revokeCardUrls();
  document.getElementById('fileCount').textContent = `${totalFiles} file`;
  updateBreadcrumb();
  renderTree();
  renderFiles();
  updateStorageWidget();
}


// ================================================
//  DRAG & DROP
// ================================================
const mainPanel = document.querySelector('.main-panel');
let dragCounter = 0;

mainPanel.addEventListener('dragenter', e => {
  e.preventDefault(); e.stopPropagation();
  dragCounter++;
  mainPanel.classList.add('drag-over');
});
mainPanel.addEventListener('dragleave', e => {
  e.preventDefault(); e.stopPropagation();
  dragCounter--;
  if (dragCounter <= 0) { dragCounter = 0; mainPanel.classList.remove('drag-over'); }
});
mainPanel.addEventListener('dragover', e => {
  e.preventDefault(); e.stopPropagation();
});
mainPanel.addEventListener('drop', async e => {
  e.preventDefault(); e.stopPropagation();
  mainPanel.classList.remove('drag-over');
  dragCounter = 0;
  await processDataTransfer(e.dataTransfer);
});

// Sidebar also accepts drops
const sidebar = document.getElementById('sidebar');
sidebar.addEventListener('dragover', e => e.preventDefault());
sidebar.addEventListener('drop', async e => {
  e.preventDefault(); e.stopPropagation();
  await processDataTransfer(e.dataTransfer);
});

// ================================================
//  FOLDER INPUT BUTTON
// ================================================
const folderInput = document.getElementById('folderInput');
document.getElementById('btnAddFolder').addEventListener('click', () => folderInput.click());
folderInput.addEventListener('change', () => {
  const files = [...folderInput.files];
  if (files.length) {
    const filesForQueue = files.map(f => ({ name: f.name, file: f }));
    queueFiles(filesForQueue);
  }
  processFolderInput(folderInput);
});

// ================================================
//  CLEAR
// ================================================
document.getElementById('btnClear').addEventListener('click', async () => {
  if (!totalFiles) return;
  const ok = await showConfirm({
    icon: '⚠️',
    title: 'Kosongkan Repository?',
    msg: 'Semua file dan folder akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
    okLabel: 'Ya, Kosongkan',
    okClass: 'btn--danger',
  });
  if (!ok) return;
  dbClearAll();
  repoRoot = { id: 'root', name: 'root', type: 'folder', path: '', children: [], file: null, parent: null };
  nodeMap = { root: repoRoot };
  nodeIdSeq = 0;
  totalFiles = 0;
  currentPath = '';
  selectedIds.clear();
  lastClickedIdx = -1;
  closeDetail();
  refreshUI();
  showToast('Repository dikosongkan');
  setDbStatus('connected', '💾 DB kosong');
});

// ================================================
//  SEARCH
// ================================================
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
let searchDebounce;

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentSearchQuery = searchInput.value;
    searchClear.classList.toggle('visible', !!currentSearchQuery);
    renderFiles();
  }, 200);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  currentSearchQuery = '';
  searchClear.classList.remove('visible');
  renderFiles();
  searchInput.focus();
});

// ================================================
//  VIEW TOGGLE
// ================================================
document.getElementById('btnGrid').addEventListener('click', () => setView('grid'));
document.getElementById('btnList').addEventListener('click', () => setView('list'));

function setView(mode) {
  viewMode = mode;
  fileGrid.classList.toggle('list-view', mode === 'list');
  document.getElementById('btnGrid').classList.toggle('active', mode === 'grid');
  document.getElementById('btnList').classList.toggle('active', mode === 'list');
  renderFiles();
}

// ================================================
//  TOAST
// ================================================
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg, type = '') {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className = 'toast ' + type + ' show';
  toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, 3000);
}

// ================================================
//  KEYBOARD SHORTCUTS
// ================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (currentSearchQuery) {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClear.classList.remove('visible');
      renderFiles();
    } else if (appLayout.classList.contains('detail-open')) {
      closeDetail();
      renderFiles();
    }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault();
    folderInput.click();
  }
});

// ================================================
//  RENAME — CONTEXT MENU
// ================================================
const ctxMenu = document.getElementById('ctxMenu');
let ctxTargetId = null;

function showContextMenu(x, y, node) {
  ctxTargetId = node.id;
  const isFolder = node.type === 'folder';
  const deleteLabel = isFolder ? 'Hapus Folder' : 'Hapus File';

  // View-only users: only show Properties
  if (isViewOnly()) {
    ctxMenu.innerHTML = `
      <div class="ctx-menu__item" id="ctxProperties">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Properties
      </div>
    `;
    ctxMenu.style.display = 'block';
    const vw = window.innerWidth, vh = window.innerHeight;
    const mw = ctxMenu.offsetWidth, mh = ctxMenu.offsetHeight;
    ctxMenu.style.left = Math.min(x, vw - mw - 8) + 'px';
    ctxMenu.style.top = Math.min(y, vh - mh - 8) + 'px';
    document.getElementById('ctxProperties').addEventListener('click', () => {
      const n = getNode(ctxTargetId); hideContextMenu();
      if (n) { showDetail(n); appLayout.classList.add('detail-open'); }
    });
    return;
  }

  const shareHtml = (isFolder && canShare()) ? `
    <div class="ctx-menu__sep"></div>
    <div class="ctx-menu__item share" id="ctxShare">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share To...
    </div>` : '';

  const deleteHtml = canDelete() ? `
    <div class="ctx-menu__sep"></div>
    <div class="ctx-menu__item danger" id="ctxDelete">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
      </svg>
      ${deleteLabel}
    </div>` : '';

  ctxMenu.innerHTML = `
    <div class="ctx-menu__item" id="ctxProperties">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Properties
    </div>
    <div class="ctx-menu__item" id="ctxDownload">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download
    </div>
    <div class="ctx-menu__sep"></div>
    <div class="ctx-menu__item" id="ctxRename">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Rename
    </div>
    <div class="ctx-menu__item" id="ctxMove">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
      </svg>
      Pindahkan ke...
    </div>
    ${shareHtml}
    ${deleteHtml}
  `;

  ctxMenu.style.display = 'block';
  const vw = window.innerWidth, vh = window.innerHeight;
  const mw = ctxMenu.offsetWidth, mh = ctxMenu.offsetHeight;
  ctxMenu.style.left = Math.min(x, vw - mw - 8) + 'px';
  ctxMenu.style.top = Math.min(y, vh - mh - 8) + 'px';

  document.getElementById('ctxProperties').addEventListener('click', () => {
    const n = getNode(ctxTargetId);
    hideContextMenu();
    if (n) { showDetail(n); appLayout.classList.add('detail-open'); }
  });
  const ctxDl = document.getElementById('ctxDownload');
  if (ctxDl) ctxDl.addEventListener('click', () => {
    const id = ctxTargetId;
    hideContextMenu();
    downloadNodes([id]);
  });
  document.getElementById('ctxRename').addEventListener('click', () => {
    const id = ctxTargetId;
    hideContextMenu();
    openRenameModal(id);
  });
  document.getElementById('ctxMove').addEventListener('click', () => {
    const id = ctxTargetId;
    hideContextMenu();
    openMoveModal([id]);
  });
  const ctxShare = document.getElementById('ctxShare');
  if (ctxShare) ctxShare.addEventListener('click', () => {
    const id = ctxTargetId;
    hideContextMenu();
    openShareModal(id);
  });
  const ctxDel = document.getElementById('ctxDelete');
  if (ctxDel) ctxDel.addEventListener('click', () => {
    const id = ctxTargetId;
    hideContextMenu();
    if (isFolder) deleteFolder(id);
    else softDeleteNodes([id]);
  });
}

function hideContextMenu() {
  ctxMenu.style.display = 'none';
  ctxTargetId = null;
}

document.addEventListener('click', hideContextMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideContextMenu(); }, true);

// ================================================
//  RENAME — MODAL
// ================================================
const renameModal = document.getElementById('renameModal');
const renameInput = document.getElementById('renameInput');
const renameCancelBtn = document.getElementById('renameCancelBtn');
const renameConfirmBtn = document.getElementById('renameConfirmBtn');
let renameTargetId = null;

function openRenameModal(nodeId) {
  const node = getNode(nodeId);
  if (!node) return;
  renameTargetId = nodeId;
  renameInput.value = node.name;
  const desc = document.getElementById('renameModalDesc');
  if (desc) desc.textContent = node.type === 'folder' ? 'Masukkan nama baru untuk folder ini' : 'Masukkan nama baru untuk file ini';
  renameModal.classList.remove('hidden');
  setTimeout(() => { renameInput.focus(); renameInput.select(); }, 50);
}

function closeRenameModal() {
  renameModal.classList.add('hidden');
  renameTargetId = null;
}

function confirmRename() {
  const newName = renameInput.value.trim();
  if (!newName) { renameInput.focus(); return; }
  if (!renameTargetId) return;
  const node = getNode(renameTargetId);
  if (!node) return;
  if (newName === node.name) { closeRenameModal(); return; }
  // For files: preserve extension
  if (node.type === 'file') {
    const oldExt = getExt(node.name);
    const newExt = getExt(newName);
    if (oldExt !== newExt) {
      showToast(`⛔ Ekstensi file tidak boleh diubah (.${oldExt})`, 'error');
      renameInput.focus(); return;
    }
  }
  // Check sibling name collision
  const parent = getNode(node.parent);
  if (parent && parent.children.some(c => c.id !== node.id && c.name === newName && c.type === node.type)) {
    showToast('Nama sudah ada di level ini', 'error');
    renameInput.focus();
    return;
  }
  // Update modified metadata
  node.modifiedBy = currentUser.name;
  node.modifiedAt = Date.now();
  updateNodeName(renameTargetId, newName);
  dbSaveNode(node);
  closeRenameModal();
  showToast(`✅ Berhasil direname menjadi "${newName}"`, 'success');
  refreshUI();
}

renameCancelBtn.addEventListener('click', closeRenameModal);
renameConfirmBtn.addEventListener('click', confirmRename);
renameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmRename();
  if (e.key === 'Escape') closeRenameModal();
});
renameModal.addEventListener('click', e => { if (e.target === renameModal) closeRenameModal(); });

// ================================================
//  RENAME — CORE LOGIC
// ================================================
function updateNodeName(nodeId, newName) {
  const node = getNode(nodeId);
  if (!node) return;
  const oldName = node.name;
  node.name = newName;
  // Recompute path for this node and all descendants
  const parentNode = node.parent ? getNode(node.parent) : null;
  const basePath = parentNode && parentNode.path ? parentNode.path + '/' + newName : newName;
  rebuildPaths(node, basePath);
  // If breadcrumb points into this tree, refresh it
  if (currentPath === nodeId || isDescendantOf(currentPath, nodeId)) {
    updateBreadcrumb();
  }
}

function rebuildPaths(node, newPath) {
  node.path = newPath;
  for (const child of node.children) {
    rebuildPaths(child, newPath + '/' + child.name);
  }
}

function isDescendantOf(nodeId, ancestorId) {
  let cur = getNode(nodeId);
  while (cur && cur.parent) {
    if (cur.parent === ancestorId) return true;
    cur = getNode(cur.parent);
  }
  return false;
}

// ================================================
//  RENAME — DELETE FOLDER
// ================================================
function deleteFolder(nodeId) {
  const node = getNode(nodeId);
  if (!node || node.type !== 'folder') return;
  // Use soft-delete (recycle bin) for folders too
  if (!canDelete()) { showToast('❌ Hanya Super Admin yang dapat menghapus folder', 'error'); return; }
  showConfirm({
    icon: '🗑️',
    title: `Hapus Folder?`,
    msg: `Folder "${node.name}" beserta seluruh isinya akan dipindahkan ke Recycle Bin.`,
    okLabel: 'Ya, Hapus',
    okClass: 'btn--danger',
  }).then(ok => {
    if (!ok) return;
    // Walk all children and soft-delete them (store in recycle bin)
    const allIds = [node.id];
    // Add node to recycle bin as folder entry
    recycleBin.push({
      id: node.id, name: node.name, type: node.type, path: node.path,
      parentId: node.parent, node,
      deletedAt: Date.now(), deletedBy: currentUser.name,
    });
    // Remove from IndexedDB
    dbDeleteSubtree(node);
    // count files to subtract
    const fc = countFiles(node);
    totalFiles -= fc;
    // remove from parent
    const parent = getNode(node.parent || 'root');
    if (parent) parent.children = parent.children.filter(c => c.id !== nodeId);
    // remove all descendants from nodeMap
    function removeFromMap(n) {
      delete nodeMap[n.id];
      for (const c of n.children) removeFromMap(c);
    }
    removeFromMap(node);
    // if current view is inside deleted folder, go home
    if (currentPath === nodeId || isDescendantOf(currentPath, nodeId)) {
      currentPath = '';
    }
    saveRecycleBin();
    showToast(`🗑️ Folder "${node.name}" dipindahkan ke Recycle Bin`, 'success');
    refreshUI();
  });
}

// ================================================
//  RENAME — INLINE TREE RENAME
// ================================================
function startInlineRename(nameEl, node) {
  const oldName = node.name;
  const input = document.createElement('input');
  input.className = 'tree-rename-input';
  input.value = oldName;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  function commit() {
    const newName = input.value.trim();
    // Restore nameEl
    const span = document.createElement('span');
    span.className = 'tree-node__name';
    span.title = newName || oldName;
    span.textContent = newName || oldName;
    input.replaceWith(span);
    if (newName && newName !== oldName) {
      const parent = getNode(node.parent);
      if (parent && parent.children.some(c => c.id !== node.id && c.name === newName && c.type === 'folder')) {
        showToast('Nama folder sudah ada di level ini', 'error');
        return;
      }
      updateNodeName(node.id, newName);
      showToast(`✅ Folder direname menjadi "${newName}"`, 'success');
      refreshUI();
    }
  }

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') {
      input.value = oldName;
      input.blur();
    }
  });
}

// ================================================
//  KEYBOARD SHORTCUT — F2 to rename selected folder
// ================================================
document.addEventListener('keydown', e => {
  if (e.key === 'F2' && currentPath) {
    e.preventDefault();
    openRenameModal(currentPath);
  }
});

// ================================================
//  SELECTION BAR
// ================================================
const selectionBar = document.getElementById('selectionBar');
const selectionCount = document.getElementById('selectionCount');
const selPreviewBtn = document.getElementById('selPreviewBtn');
const selClearBtn = document.getElementById('selClearBtn');

function updateSelectionBar() {
  const n = selectedIds.size;
  if (n === 0) {
    selectionBar.classList.add('hidden');
    return;
  }
  selectionBar.classList.remove('hidden');
  selectionCount.textContent = `${n} item dipilih`;

  // Show preview btn only if exactly 1 media file selected
  const arr = [...selectedIds];
  const oneMedia = arr.length === 1 && (() => {
    const node = getNode(arr[0]);
    return node && node.type === 'file' && isMedia(node.name) && node.file;
  })();
  selPreviewBtn.style.display = oneMedia ? 'inline-flex' : 'none';

  // Show download btn
  if (selDownloadBtn) selDownloadBtn.style.display = 'inline-flex';

  // Show move btn (always visible when items selected)
  const selMoveBtn = document.getElementById('selMoveBtn');
  if (selMoveBtn) selMoveBtn.style.display = 'inline-flex';

  // Show delete btn only for Super Admin
  const selDeleteBtn = document.getElementById('selDeleteBtn');
  if (selDeleteBtn) selDeleteBtn.style.display = canDelete() ? 'inline-flex' : 'none';
}

selPreviewBtn.addEventListener('click', () => {
  const arr = [...selectedIds];
  if (!arr.length) return;
  const node = getNode(arr[0]);
  if (node && isMedia(node.name) && node.file) openLightbox(node);
});

selClearBtn.addEventListener('click', clearSelection);

// ================================================
//  MOVE NODE
// ================================================
/**
 * Move a node (file or folder) to a new parent folder.
 * Detaches from old parent and attaches to newParentId.
 * Refuses if newParentId is inside node's subtree (moving folder into itself).
 */
function moveNode(nodeId, newParentId) {
  if (nodeId === newParentId) { showToast('⛔ Tidak bisa memindahkan ke folder yang sama', 'error'); return false; }
  const node = getNode(nodeId);
  const newParent = getNode(newParentId);
  if (!node || !newParent) return false;
  if (newParent.type !== 'folder') { showToast('⛔ Tujuan harus berupa folder', 'error'); return false; }
  if (node.parent === newParentId) { showToast('📂 File sudah berada di folder ini', 'error'); return false; }

  // Check circular: ensure newParentId is not inside node's subtree
  function isDescendant(ancestor, targetId) {
    if (ancestor.id === targetId) return true;
    return ancestor.children.some(c => isDescendant(c, targetId));
  }
  if (isDescendant(node, newParentId)) {
    showToast('⛔ Tidak bisa memindahkan folder ke dalam subfolder-nya sendiri', 'error');
    return false;
  }

  // Detach from old parent
  const oldParent = getNode(node.parent || 'root');
  if (oldParent) oldParent.children = oldParent.children.filter(c => c.id !== nodeId);

  // Attach to new parent
  node.parent = newParentId;
  node.path = (newParent.path ? newParent.path + '/' : '') + node.name;
  newParent.children.push(node);

  dbSaveNode(node);
  return true;
}

// Move modal wiring
const moveModal = document.getElementById('moveModal');
const moveFolderTree = document.getElementById('moveFolderTree');
const moveConfirmBtn = document.getElementById('moveModalConfirm');
const moveCancelBtn = document.getElementById('moveModalCancel');
const moveCloseBtn = document.getElementById('moveModalClose');
let moveTargetIds = [];
let moveSelectedFolderId = null;

function buildMoveFolderTree(container, parentNode, excludeIds, depth = 0) {
  parentNode.children.forEach(child => {
    if (child.type !== 'folder') return;
    if (excludeIds.includes(child.id)) return;

    const hasSubs = child.children.some(c => c.type === 'folder' && !excludeIds.includes(c.id));
    // Use a per-modal expand map stored on the container element
    if (!container._moveExpandMap) container._moveExpandMap = {};
    const isExp = container._moveExpandMap[child.id] !== false; // default expanded

    const wrapper = document.createElement('div');
    wrapper.className = 'move-tree-node';

    const item = document.createElement('div');
    item.className = 'move-tree-item';
    item.style.paddingLeft = (depth * 16 + 8) + 'px';
    item.dataset.id = child.id;
    item.innerHTML = `
      <span class="move-tree-arrow ${hasSubs ? '' : 'hidden'} ${isExp ? 'open' : ''}">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 2 8 6 4 10"/></svg>
      </span>
      <svg viewBox="0 0 20 20" fill="none" class="move-tree-icon">
        <path d="M4 7h5l2 2h5v7H4V7z" fill="#0066B3" fill-opacity="0.25" stroke="#0066B3" stroke-width="1.2"/>
      </svg>
      <span class="move-tree-label">${escapeHtml(child.name)}</span>`;

    // Click on arrow → toggle expand
    const arrowSpan = item.querySelector('.move-tree-arrow');
    if (arrowSpan && hasSubs) {
      arrowSpan.addEventListener('click', e => {
        e.stopPropagation();
        container._moveExpandMap[child.id] = !isExp;
        // Re-render sub-children only
        childrenWrap.style.display = container._moveExpandMap[child.id] === false ? 'none' : '';
        arrowSpan.classList.toggle('open', container._moveExpandMap[child.id] !== false);
      });
    }

    // Click on item → select as destination
    item.addEventListener('click', e => {
      if (e.target.closest('.move-tree-arrow')) return;
      moveFolderTree.querySelectorAll('.move-tree-item.selected').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      moveSelectedFolderId = child.id;
      if (moveConfirmBtn) moveConfirmBtn.disabled = false;
    });

    const childrenWrap = document.createElement('div');
    childrenWrap.className = 'move-tree-children';
    childrenWrap.style.display = isExp ? '' : 'none';
    // Pass same container expand map down
    childrenWrap._moveExpandMap = container._moveExpandMap;

    buildMoveFolderTree(childrenWrap, child, excludeIds, depth + 1);

    wrapper.appendChild(item);
    wrapper.appendChild(childrenWrap);
    container.appendChild(wrapper);
  });
}

function openMoveModal(nodeIds) {
  moveTargetIds = nodeIds;
  moveSelectedFolderId = null;
  moveFolderTree.innerHTML = '';
  moveFolderTree._moveExpandMap = {}; // Initialize shared expand map
  if (moveConfirmBtn) moveConfirmBtn.disabled = true;

  // Build exclusion list: the selected nodes themselves + current folder
  // (can't move a folder into itself or its own subtree)
  const excludeIds = [...nodeIds];
  if (currentPath && !excludeIds.includes(currentPath)) {
    excludeIds.push(currentPath);
  }

  // Check if root/home should be excluded (only if 'root' is in nodeIds - unlikely)
  const showHome = !excludeIds.includes('root');
  if (showHome) {
    const homeRow = document.createElement('div');
    homeRow.className = 'move-tree-node';

    const rootItem = document.createElement('div');
    rootItem.className = 'move-tree-item';
    rootItem.style.paddingLeft = '8px';
    rootItem.dataset.id = 'root';

    // Check if root has folder children (outside exclusions)
    const rootHasSubs = repoRoot.children.some(c => c.type === 'folder' && !excludeIds.includes(c.id));
    const rootIsExp = moveFolderTree._moveExpandMap['root'] !== false;
    rootItem.innerHTML = `
      <span class="move-tree-arrow ${rootHasSubs ? '' : 'hidden'} ${rootIsExp ? 'open' : ''}">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 2 8 6 4 10"/></svg>
      </span>
      <svg viewBox="0 0 20 20" fill="none" class="move-tree-icon">
        <path d="M10 3L2 9h3v8h4v-5h2v5h4V9h3L10 3z" fill="#0066B3" fill-opacity="0.3" stroke="#0066B3" stroke-width="1.2"/>
      </svg>
      <span class="move-tree-label">🏠 Home (root)</span>`;

    const rootChildrenWrap = document.createElement('div');
    rootChildrenWrap.className = 'move-tree-children';
    rootChildrenWrap.style.display = rootIsExp ? '' : 'none';
    rootChildrenWrap._moveExpandMap = moveFolderTree._moveExpandMap;

    // Arrow toggle for home
    const homeArrow = rootItem.querySelector('.move-tree-arrow');
    if (homeArrow && rootHasSubs) {
      homeArrow.addEventListener('click', e => {
        e.stopPropagation();
        const nowExp = moveFolderTree._moveExpandMap['root'] !== false;
        moveFolderTree._moveExpandMap['root'] = !nowExp;
        rootChildrenWrap.style.display = moveFolderTree._moveExpandMap['root'] === false ? 'none' : '';
        homeArrow.classList.toggle('open', moveFolderTree._moveExpandMap['root'] !== false);
      });
    }

    rootItem.addEventListener('click', e => {
      if (e.target.closest('.move-tree-arrow')) return;
      moveFolderTree.querySelectorAll('.move-tree-item.selected').forEach(el => el.classList.remove('selected'));
      rootItem.classList.add('selected');
      moveSelectedFolderId = 'root';
      if (moveConfirmBtn) moveConfirmBtn.disabled = false;
    });

    buildMoveFolderTree(rootChildrenWrap, repoRoot, excludeIds, 1);

    homeRow.appendChild(rootItem);
    homeRow.appendChild(rootChildrenWrap);
    moveFolderTree.appendChild(homeRow);
  }

  moveModal.classList.remove('hidden');
}

function closeMoveModal() {
  moveModal.classList.add('hidden');
  moveTargetIds = [];
  moveSelectedFolderId = null;
  // If closed while in restore-to-folder mode, reset title and pending entry
  if (_pendingRestoreBinEntry) {
    _pendingRestoreBinEntry = null;
    const titleEl = document.getElementById('moveModalTitle');
    if (titleEl) titleEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
        <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
      </svg>
      Pindahkan ke Folder`;
  }
}

if (moveConfirmBtn) moveConfirmBtn.addEventListener('click', () => {
  if (!moveSelectedFolderId) return;

  // Handle recycle-bin restore-to-folder flow
  if (_pendingRestoreBinEntry) {
    const entry = _pendingRestoreBinEntry;
    _pendingRestoreBinEntry = null;
    // Reset modal title
    const titleEl = document.getElementById('moveModalTitle');
    if (titleEl) titleEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
        <path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/>
      </svg>
      Pindahkan ke Folder`;
    closeMoveModal();
    restoreNode(entry, moveSelectedFolderId);
    return;
  }

  let movedCount = 0;
  moveTargetIds.forEach(id => {
    if (moveNode(id, moveSelectedFolderId)) movedCount++;
  });
  closeMoveModal();
  clearSelection();
  refreshUI();
  if (movedCount) showToast(`✅ ${movedCount} item berhasil dipindahkan`, 'success');
});

if (moveCancelBtn) moveCancelBtn.addEventListener('click', closeMoveModal);
if (moveCloseBtn) moveCloseBtn.addEventListener('click', closeMoveModal);
if (moveModal) moveModal.addEventListener('click', e => { if (e.target === moveModal) closeMoveModal(); });

// Wire selMoveBtn
const selMoveBtn = document.getElementById('selMoveBtn');
if (selMoveBtn) selMoveBtn.addEventListener('click', () => {
  const ids = [...selectedIds];
  if (!ids.length) return;
  openMoveModal(ids);
});

// ================================================
//  MEDIA LIGHTBOX
// ================================================
const lightbox = document.getElementById('mediaLightbox');
const lbContent = document.getElementById('lbContent');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let lbItems = []; // array of media nodes in current folder
let lbIndex = 0;
let lbObjectUrl = null;

function getMediaSiblings(node) {
  const parent = node.parent ? getNode(node.parent) : repoRoot;
  if (!parent) return [node];
  return parent.children.filter(c => c.type === 'file' && isMedia(c.name) && c.file);
}

function openLightbox(node) {
  lbItems = getMediaSiblings(node);
  lbIndex = lbItems.findIndex(n => n.id === node.id);
  if (lbIndex < 0) { lbItems = [node]; lbIndex = 0; }
  renderLightbox();
}

function renderLightbox() {
  const node = lbItems[lbIndex];
  if (!node || !node.file) return;

  // Revoke previous URL
  if (lbObjectUrl) { URL.revokeObjectURL(lbObjectUrl); lbObjectUrl = null; }

  const url = URL.createObjectURL(node.file);
  lbObjectUrl = url;
  const ext = getExt(node.name);
  const vid = isVideo(node.name);

  // Apply video-mode class for YouTube layout
  lightbox.classList.toggle('video-mode', vid);

  if (vid) {
    lbContent.innerHTML = `<video src="${url}" controls autoplay playsinline></video>`;
    const size = node.file ? formatSize(node.file.size) : '';
    const mod = node.file ? new Date(node.file.lastModified).toLocaleDateString('id-ID') : '';
    lbCaption.innerHTML = `
      <strong>${escapeHtml(node.name)}</strong>
      <div class="vid-meta">
        <span class="vid-chip">📹 ${ext.toUpperCase()}</span>
        <span class="vid-chip">💾 ${size}</span>
        <span class="vid-chip">📅 ${mod}</span>
        <span class="vid-chip">${lbIndex + 1} / ${lbItems.length}</span>
      </div>`;
  } else {
    lbContent.innerHTML = `<img src="${url}" alt="${escapeHtml(node.name)}" />`;
    lbCaption.innerHTML = `<strong>${escapeHtml(node.name)}</strong><span>${ext.toUpperCase()} · ${node.file ? formatSize(node.file.size) : ''} · ${lbIndex + 1}/${lbItems.length}</span>`;
  }

  lbPrev.disabled = lbIndex === 0;
  lbNext.disabled = lbIndex === lbItems.length - 1;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Counter badge
  let counter = lightbox.querySelector('.lightbox__counter');
  if (!counter) { counter = document.createElement('div'); counter.className = 'lightbox__counter'; lightbox.appendChild(counter); }
  counter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  counter.style.display = lbItems.length > 1 ? 'block' : 'none';
}

function closeLightbox() {
  lightbox.classList.add('hidden');
  lightbox.classList.remove('video-mode');
  lbContent.innerHTML = '';
  lbCaption.innerHTML = '';
  document.body.style.overflow = '';
  if (lbObjectUrl) { URL.revokeObjectURL(lbObjectUrl); lbObjectUrl = null; }
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => { if (lbIndex > 0) { lbIndex--; renderLightbox(); } });
lbNext.addEventListener('click', () => { if (lbIndex < lbItems.length - 1) { lbIndex++; renderLightbox(); } });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') { if (lbIndex < lbItems.length - 1) { lbIndex++; renderLightbox(); } }
  if (e.key === 'ArrowLeft') { if (lbIndex > 0) { lbIndex--; renderLightbox(); } }
  if (e.key === 'Escape') closeLightbox();
});

// ================================================
//  UPLOAD JOB QUEUE
// ================================================
const uploadQueue = document.getElementById('uploadQueue');
const queueBody = document.getElementById('queueBody');
const queueStats = document.getElementById('queueStats');
const queueMinimize = document.getElementById('queueMinimize');
const queueClose = document.getElementById('queueClose');
const queueBubble = document.getElementById('queueBubble');
const queueBubbleCount = document.getElementById('queueBubbleCount');

let queueJobs = []; // { id, name, file, status: 'pending'|'uploading'|'done'|'error', progress: 0..100 }
let queueSeq = 0;
let queueMinimized = false;

function queueFiles(fileList) {
  // fileList: array of {name, file} objects
  fileList.forEach(({ name, file }) => {
    const id = 'q' + (++queueSeq);
    queueJobs.push({ id, name, file, status: 'pending', progress: 0 });
  });
  showQueue();
  updateQueueUI();
  processQueue();
}

function processQueue() {
  const pending = queueJobs.filter(j => j.status === 'pending');
  if (!pending.length) return;
  // Process up to 3 concurrently
  const uploading = queueJobs.filter(j => j.status === 'uploading').length;
  const slots = Math.max(0, 3 - uploading);
  pending.slice(0, slots).forEach(job => simulateUpload(job));
}

function simulateUpload(job) {
  job.status = 'uploading';
  job.progress = 0;
  updateQueueUI();
  const duration = 800 + Math.random() * 1500; // 0.8–2.3 s
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    job.progress = Math.min(100, Math.round((elapsed / duration) * 100));
    updateQueueItem(job);
    if (job.progress < 100) {
      requestAnimationFrame(tick);
    } else {
      job.status = Math.random() > 0.05 ? 'done' : 'error'; // 5% error rate
      updateQueueItem(job);
      updateQueueStats();
      processQueue(); // pick up next pending
    }
  };
  requestAnimationFrame(tick);
}

function showQueue() {
  if (queueMinimized) {
    queueBubble.classList.remove('hidden');
    uploadQueue.classList.add('hidden');
  } else {
    uploadQueue.classList.remove('hidden');
    queueBubble.classList.add('hidden');
  }
}

function updateQueueUI() {
  queueBody.innerHTML = '';
  queueJobs.forEach(job => {
    const el = buildQueueItem(job);
    el.id = 'qi-' + job.id;
    queueBody.appendChild(el);
  });
  updateQueueStats();
}

function buildQueueItem(job) {
  const el = document.createElement('div');
  el.className = 'queue-item';
  el.id = 'qi-' + job.id;

  let stateHtml = '';
  if (job.status === 'uploading') {
    stateHtml = `<span class="queue-item__state q-spin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></span>`;
  } else if (job.status === 'done') {
    stateHtml = `<span class="queue-item__state q-done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></span>`;
  } else if (job.status === 'error') {
    stateHtml = `<span class="queue-item__state q-err"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>`;
  } else {
    stateHtml = `<span class="queue-item__state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>`;
  }

  const progressBar = job.status === 'done' ? '100' :
    job.status === 'error' ? '100' :
      job.progress;
  const progressColor = job.status === 'error' ? 'background:var(--danger)' : '';
  const statusText = job.status === 'uploading' ? `Mengunggah ${job.progress}%` :
    job.status === 'done' ? 'Selesai' :
      job.status === 'error' ? 'Gagal' : 'Menunggu…';

  el.innerHTML = `
    <span class="queue-item__icon">${buildFileIcon(job.name, 28)}</span>
    <span class="queue-item__info">
      <div class="queue-item__name">${escapeHtml(job.name)}</div>
      <div class="queue-item__status">${statusText}</div>
      <div class="queue-item__progress"><div class="queue-item__progress-bar" style="width:${progressBar}%;${progressColor}"></div></div>
    </span>
    ${stateHtml}
  `;
  return el;
}

function updateQueueItem(job) {
  const existing = document.getElementById('qi-' + job.id);
  if (!existing) return;
  const fresh = buildQueueItem(job);
  existing.replaceWith(fresh);
  updateQueueStats();
}

function updateQueueStats() {
  const done = queueJobs.filter(j => j.status === 'done').length;
  const err = queueJobs.filter(j => j.status === 'error').length;
  const total = queueJobs.length;
  queueStats.textContent = `${done + err}/${total}`;
  queueBubbleCount.textContent = total - done - err > 0 ? total - done - err : done + err;
}

// Wire queue controls
queueMinimize.addEventListener('click', () => {
  queueMinimized = true;
  uploadQueue.classList.add('hidden');
  queueBubble.classList.remove('hidden');
});
queueClose.addEventListener('click', () => {
  queueJobs = [];
  uploadQueue.classList.add('hidden');
  queueBubble.classList.add('hidden');
});
queueBubble.addEventListener('click', () => {
  queueMinimized = false;
  queueBubble.classList.add('hidden');
  uploadQueue.classList.remove('hidden');
});

// Hook into processDataTransfer to trigger queue
// Wrap original to also call queueFiles
const _origProcessDataTransfer = processDataTransfer;
async function processDataTransferWithQueue(dataTransfer) {
  // Collect flat file list for queue display
  const items = [...dataTransfer.items];
  const fileItems = items.filter(i => i.kind === 'file');

  if (!fileItems.length) {
    showToast('Tidak ada file/folder yang terdeteksi', 'error');
    return;
  }

  // Collect files for queue (flat list)
  const filesForQueue = [];
  const collectFiles = async (entry) => {
    if (!entry) return;
    if (entry.isDirectory) {
      const reader = entry.createReader();
      const readAll = () => new Promise((res, rej) => {
        const results = [];
        const readBatch = () => reader.readEntries(batch => {
          if (batch.length === 0) return res(results);
          results.push(...batch); readBatch();
        }, rej);
        readBatch();
      });
      const children = await readAll();
      for (const child of children) await collectFiles(child);
    } else {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      filesForQueue.push({ name: file.name, file });
    }
  };

  const entries = fileItems
    .map(i => i.webkitGetAsEntry ? i.webkitGetAsEntry() : null)
    .filter(Boolean);

  for (const entry of entries) await collectFiles(entry);

  // Kick off queue display first
  if (filesForQueue.length) queueFiles(filesForQueue);

  // Then do the actual repo insertion
  await _origProcessDataTransfer(dataTransfer);
}

// Override main panel drop to also trigger queue
mainPanel.removeEventListener('drop', mainPanel._dropHandler);
const newDropHandler = async e => {
  e.preventDefault(); e.stopPropagation();
  mainPanel.classList.remove('drag-over');
  dragCounter = 0;
  await processDataTransferWithQueue(e.dataTransfer);
};
mainPanel.addEventListener('drop', newDropHandler);

// INIT removed from here, moved to openDB promise

const selDownloadBtn = document.getElementById('selDownloadBtn');
if (selDownloadBtn) {
  selDownloadBtn.addEventListener('click', () => {
    const ids = [...selectedIds];
    if (ids.length) downloadNodes(ids);
  });
}

// ── selDeleteBtn ─────────────────────────────────
const selDeleteBtn = document.getElementById('selDeleteBtn');
if (selDeleteBtn) {
  selDeleteBtn.addEventListener('click', async () => {
    const ids = [...selectedIds];
    if (!ids.length) return;
    const ok = await showConfirm({
      icon: '🗑️',
      title: `Hapus ${ids.length} item?`,
      msg: `${ids.length} item yang dipilih akan dipindahkan ke Recycle Bin.`,
      okLabel: 'Ya, Hapus',
      okClass: 'btn--danger',
    });
    if (!ok) return;
    softDeleteNodes(ids);
  });
}

// ── Create Folder Modal ──────────────────────────
const createFolderModal = document.getElementById('createFolderModal');
const createFolderInput = document.getElementById('createFolderInput');
const createFolderConfirmBtn = document.getElementById('createFolderConfirmBtn');
const createFolderCancelBtn = document.getElementById('createFolderCancelBtn');

function openCreateFolderModal() {
  if (createFolderModal) {
    createFolderInput.value = '';
    createFolderModal.classList.remove('hidden');
    setTimeout(() => { createFolderInput.focus(); }, 50);
  }
}
function closeCreateFolderModal() {
  if (createFolderModal) createFolderModal.classList.add('hidden');
}
function confirmCreateFolder() {
  const name = createFolderInput.value.trim();
  if (!name) { createFolderInput.focus(); return; }
  const parentId = currentPath || 'root';
  const pid = insertNode(parentId, name, 'folder');
  if (!pid) { showToast('Gagal membuat folder', 'error'); return; }
  showToast(`✅ Folder "${name}" dibuat`, 'success');
  closeCreateFolderModal();
  refreshUI();
}
if (createFolderConfirmBtn) createFolderConfirmBtn.addEventListener('click', confirmCreateFolder);
if (createFolderCancelBtn) createFolderCancelBtn.addEventListener('click', closeCreateFolderModal);
if (createFolderInput) {
  createFolderInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') confirmCreateFolder();
    if (e.key === 'Escape') closeCreateFolderModal();
  });
}
if (createFolderModal) createFolderModal.addEventListener('click', e => { if (e.target === createFolderModal) closeCreateFolderModal(); });

const btnNewFolder = document.getElementById('btnNewFolder');
if (btnNewFolder) btnNewFolder.addEventListener('click', openCreateFolderModal);

const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSortMode = e.target.value;
    renderFiles();
  });
}

// ── Icon Size Slider ─────────────────────────────
const iconSizeSlider = document.getElementById('iconSizeSlider');
const SIZE_MAP = {
  1: { card: '100px', thumb: '56%', label: 'Kecil' },
  2: { card: '160px', thumb: '62%', label: 'Sedang' },
  3: { card: '220px', thumb: '68%', label: 'Besar' },
  4: { card: '300px', thumb: '74%', label: 'XL' },
  5: { card: '400px', thumb: '80%', label: 'XXL' },
};
function applyIconSize(level) {
  iconSizeLevel = level;
  const cfg = SIZE_MAP[level] || SIZE_MAP[2];
  const root = document.documentElement;
  root.style.setProperty('--card-min-width', cfg.card);
  root.style.setProperty('--thumb-pb', cfg.thumb);
  root.setAttribute('data-icon-size', level);
  // Update tooltip on slider
  if (iconSizeSlider) iconSizeSlider.title = cfg.label;
}
if (iconSizeSlider) {
  iconSizeSlider.value = iconSizeLevel;
  applyIconSize(iconSizeLevel);
  iconSizeSlider.addEventListener('input', () => applyIconSize(parseInt(iconSizeSlider.value)));
}


// ── Recycle Bin Modal ────────────────────────────
const recycleBinModal = document.getElementById('recycleBinModal');
const recycleBinCloseBtn = document.getElementById('recycleBinCloseBtn');
const recycleClearAllBtn = document.getElementById('recycleClearAllBtn');
const btnRecycleBin = document.getElementById('btnRecycleBin');

if (btnRecycleBin) btnRecycleBin.addEventListener('click', () => {
  if (recycleBinModal) {
    recycleBinModal.classList.remove('hidden');
    renderRecycleBinList();
  }
});
if (recycleBinCloseBtn) recycleBinCloseBtn.addEventListener('click', () => recycleBinModal.classList.add('hidden'));
if (recycleClearAllBtn) recycleClearAllBtn.addEventListener('click', async () => {
  if (!canDelete()) { showToast('❌ Hanya Super Admin', 'error'); return; }
  if (!recycleBin.length) return;
  const ok = await showConfirm({
    icon: '⚠️',
    title: 'Hapus Semua Permanen?',
    msg: `Semua ${recycleBin.length} item di Recycle Bin akan dihapus permanen dan tidak dapat dipulihkan.`,
    okLabel: 'Ya, Hapus Semua',
    okClass: 'btn--danger',
  });
  if (!ok) return;
  recycleBin.forEach(e => {
    if (e.node) {
      dbDeleteSubtree(e.node);
      function removeMap(n) { delete nodeMap[n.id]; n.children.forEach(removeMap); }
      removeMap(e.node);
    }
  });
  recycleBin = [];
  saveRecycleBin();
  renderRecycleBinList();
  showToast('🗑️ Recycle Bin dikosongkan', 'success');
});
if (recycleBinModal) recycleBinModal.addEventListener('click', e => { if (e.target === recycleBinModal) recycleBinModal.classList.add('hidden'); });

// ── Sidebar Recycle Bin button ────────────────────
const sidebarRecycleBtn = document.getElementById('sidebarRecycleBtn');
if (sidebarRecycleBtn) sidebarRecycleBtn.addEventListener('click', () => {
  if (recycleBinModal) {
    recycleBinModal.classList.remove('hidden');
    renderRecycleBinList();
  }
});


// ── Role Switch (demo) ───────────────────────────
const btnSwitchRole = document.getElementById('btnSwitchRole');
if (btnSwitchRole) btnSwitchRole.addEventListener('click', () => {
  const roles = ['super_admin', 'admin'];
  const idx = roles.indexOf(currentUser.role);
  const next = roles[(idx + 1) % roles.length];
  setRole(next, currentUser.name);
  showToast(`🔄 Role: ${next === 'super_admin' ? 'Super Admin' : 'Admin'}`, 'success');
});

// ── Login Flow ───────────────────────────────────
const loginOverlay = document.getElementById('loginOverlay');
const loginBtn = document.getElementById('loginBtn');
const loginNameInput = document.getElementById('loginName');

// Populate office selector from BRANCH_OFFICES
(function initOfficePicker() {
  const wrap = document.getElementById('officeSelectorWrap');
  const sel  = document.getElementById('officeSelector');
  const lbl  = document.getElementById('officeSelectorLabel');
  if (!wrap || !sel) return;

  // Show/hide office picker based on selected role
  function updateOfficePicker() {
    const roleEl = document.querySelector('input[name="loginRole"]:checked');
    const role = roleEl ? roleEl.value : '';
    const isBranch = role === 'kantor_cabang' || role === 'kedeputian_wilayah';
    wrap.classList.toggle('visible', isBranch);
    if (lbl) lbl.textContent = role === 'kedeputian_wilayah' ? 'Pilih Kedeputian Wilayah' : 'Pilih Kantor Cabang';

    // Re-populate options based on role type
    const typeFilter = role === 'kedeputian_wilayah' ? 'wilayah' : 'cabang';
    sel.innerHTML = `<option value="">— Pilih kantor —</option>`;
    BRANCH_OFFICES.filter(o => o.type === typeFilter).forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = o.name;
      sel.appendChild(opt);
    });
  }

  document.querySelectorAll('input[name="loginRole"]').forEach(r => {
    r.addEventListener('change', updateOfficePicker);
  });
  updateOfficePicker();
})();

function doLogin() {
  const nameInput = document.getElementById('loginName');
  const nppInput  = document.getElementById('loginNPP');
  const jabInput  = document.getElementById('loginJabatan');

  const name     = (nameInput ? nameInput.value.trim() : '') || 'User';
  const npp      = nppInput  ? nppInput.value.trim()  : '';
  const jabatan  = jabInput  ? jabInput.value.trim()  : '';

  const roleEl = document.querySelector('input[name="loginRole"]:checked');
  const role = roleEl ? roleEl.value : 'admin';

  // Validate office selection for branch roles
  const isBranch = role === 'kantor_cabang' || role === 'kedeputian_wilayah';
  const officeSelector = document.getElementById('officeSelector');
  const officeId = officeSelector ? officeSelector.value : '';
  if (isBranch && !officeId) {
    showToast('⚠️ Pilih kantor terlebih dahulu', 'error');
    return;
  }

  setRole(role, name, officeId || null, npp, jabatan);
  if (loginOverlay) loginOverlay.classList.add('hidden');
  showToast('✅ Selamat datang, ' + name + '!', 'success');
  refreshUI();
}

// Auto-restore session
const savedUser = sessionStorage.getItem('fv_user');
if (savedUser) {
  try {
    const u = JSON.parse(savedUser);
    currentUser = { name: u.name || 'User', role: u.role || 'super_admin', officeId: u.officeId || null, npp: u.npp || '', jabatan: u.jabatan || '' };
    updateUserChip();
    // Re-apply view-only mode if branch role
    if (u.role === 'kantor_cabang' || u.role === 'kedeputian_wilayah') {
      document.body.classList.add('view-only-mode');
      const banner = document.getElementById('viewOnlyBanner');
      if (banner) banner.classList.add('visible');
      const officeNameEl = document.getElementById('viewOnlyOfficeName');
      if (officeNameEl && u.officeId) {
        const office = BRANCH_OFFICES.find(o => o.id === u.officeId);
        if (officeNameEl) officeNameEl.textContent = office ? office.name : '';
      }
    }
    if (loginOverlay) loginOverlay.classList.add('hidden');
  } catch { /* ignore */ }
}

if (loginBtn) loginBtn.addEventListener('click', doLogin);
if (loginNameInput) loginNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

// Load share registry before first render
loadShareRegistry();
refreshUI();

// ================================================
//  DOWNLOAD FILES / FOLDERS
// ================================================
async function downloadNodes(ids) {
  if (!ids.length) return;
  showToast(`⏳ Memproses unduhan untuk ${ids.length} item...`, 'success');

  for (const id of ids) {
    const node = getNode(id);
    if (!node) continue;

    if (node.type === 'file' && node.file) {
      // Direct file download
      const url = URL.createObjectURL(node.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = node.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    } else if (node.type === 'folder') {
      // Folder download via JSZip
      if (typeof JSZip === 'undefined') {
        showToast('❌ JSZip library tidak ditemukan', 'error');
        continue;
      }
      
      const zip = new JSZip();
      
      const addFolderToZip = (folderNode, currentZip) => {
        folderNode.children.forEach(child => {
          if (child.type === 'file' && child.file) {
            currentZip.file(child.name, child.file);
          } else if (child.type === 'folder') {
            const newZipFolder = currentZip.folder(child.name);
            addFolderToZip(child, newZipFolder);
          }
        });
      };
      
      addFolderToZip(node, zip);
      
      try {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = node.name + '.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1000);
      } catch (err) {
        console.error('Zip generation error:', err);
        showToast(`❌ Gagal mengompres folder ${node.name}`, 'error');
      }
    }
  }
}

// ================================================
//  SHARE TO MODAL
// ================================================
let _shareTargetId = null;
let _shareSelectedOffices = []; // [{officeId, name, type}]

function openShareModal(nodeId) {
  const node = getNode(nodeId);
  if (!node || node.type !== 'folder') return;
  _shareTargetId = nodeId;
  _shareSelectedOffices = [];

  // Set header info
  const titleEl = document.getElementById('shareModalFolderName');
  if (titleEl) titleEl.textContent = String.fromCodePoint(0x1F4C1) + ' ' + node.name;

  // Set default expire date = 30 days from today
  const dateInput = document.getElementById('shareExpireDate');
  if (dateInput) {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = d.toISOString().split('T')[0];
    document.querySelectorAll('.share-preset-btn').forEach(b => b.classList.remove('active'));
    const preset30 = document.querySelector('.share-preset-btn[data-days="30"]');
    if (preset30) preset30.classList.add('active');
  }

  // Render search list & chips
  _renderShareOfficeList('');
  _renderShareChips();
  _renderCurrentShares(nodeId);

  // Clear search
  const searchEl = document.getElementById('shareSearchInput');
  if (searchEl) searchEl.value = '';

  _updateShareConfirmBtn();

  document.getElementById('shareModal').classList.remove('hidden');
  setTimeout(() => { if (searchEl) searchEl.focus(); }, 80);
}

function closeShareModal() {
  document.getElementById('shareModal').classList.add('hidden');
  _shareTargetId = null;
  _shareSelectedOffices = [];
}

function _renderShareOfficeList(query) {
  const list = document.getElementById('shareOfficeList');
  if (!list) return;
  const q = query.toLowerCase().trim();
  const filtered = BRANCH_OFFICES.filter(o =>
    !q || o.name.toLowerCase().includes(q) || o.type.includes(q)
  );
  list.innerHTML = '';
  if (!filtered.length) {
    list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:12px;">Tidak ada hasil</div>';
    return;
  }
  filtered.forEach(office => {
    const isSelected = _shareSelectedOffices.some(s => s.officeId === office.id);
    const item = document.createElement('div');
    item.className = 'share-office-item' + (isSelected ? ' already-selected' : '');
    item.innerHTML =
      '<span class="share-office-type-badge ' + office.type + '">' + (office.type === 'cabang' ? 'KC' : 'KW') + '</span>' +
      '<span style="flex:1">' + escapeHtml(office.name) + '</span>' +
      '<svg class="share-office-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    item.addEventListener('click', () => {
      if (isSelected) {
        _shareSelectedOffices = _shareSelectedOffices.filter(s => s.officeId !== office.id);
      } else {
        _shareSelectedOffices.push({ officeId: office.id, name: office.name, type: office.type });
      }
      _renderShareOfficeList(document.getElementById('shareSearchInput') ? document.getElementById('shareSearchInput').value : '');
      _renderShareChips();
      _updateShareConfirmBtn();
    });
    list.appendChild(item);
  });
}

function _renderShareChips() {
  const area = document.getElementById('shareChipsArea');
  if (!area) return;
  area.innerHTML = '';
  if (!_shareSelectedOffices.length) {
    area.innerHTML = '<span class="share-chips-empty">Belum ada kantor dipilih</span>';
    return;
  }
  _shareSelectedOffices.forEach(sel => {
    const chip = document.createElement('span');
    chip.className = 'share-chip';
    chip.innerHTML = escapeHtml(sel.name) + '<button class="share-chip__remove" title="Hapus">✕</button>';
    chip.querySelector('.share-chip__remove').addEventListener('click', () => {
      _shareSelectedOffices = _shareSelectedOffices.filter(s => s.officeId !== sel.officeId);
      _renderShareOfficeList(document.getElementById('shareSearchInput') ? document.getElementById('shareSearchInput').value : '');
      _renderShareChips();
      _updateShareConfirmBtn();
    });
    area.appendChild(chip);
  });
}

function _renderCurrentShares(nodeId) {
  const section = document.getElementById('currentSharesSection');
  const list = document.getElementById('currentSharesList');
  if (!section || !list) return;
  const reg = shareRegistry[nodeId];
  if (!reg || !reg.shares || !reg.shares.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = '';
  const now = Date.now();
  reg.shares.forEach(share => {
    const office = BRANCH_OFFICES.find(o => o.id === share.officeId);
    const officeName = office ? office.name : share.officeId;
    const expDate = new Date(share.expiredAt);
    const daysLeft = Math.ceil((share.expiredAt - now) / (1000 * 60 * 60 * 24));
    const isExpired = share.expiredAt <= now;
    const isExpiring = !isExpired && daysLeft <= 7;
    const expiryClass = isExpired ? 'expired' : (isExpiring ? 'expiring' : 'valid');
    const expiryText = isExpired ? 'Expired' : (daysLeft + ' hari lagi (' + expDate.toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) + ')');
    const item = document.createElement('div');
    item.className = 'current-share-item';
    item.innerHTML =
      '<span class="current-share-item__name">' + escapeHtml(officeName) + '</span>' +
      '<span class="current-share-item__expiry ' + expiryClass + '">' + expiryText + '</span>' +
      '<button class="current-share-item__revoke" data-office="' + escapeHtml(share.officeId) + '">✕</button>';
    item.querySelector('.current-share-item__revoke').addEventListener('click', function() {
      revokeShare(nodeId, this.dataset.office);
      _renderCurrentShares(nodeId);
    });
    list.appendChild(item);
  });
}

function _updateShareConfirmBtn() {
  const btn = document.getElementById('shareModalConfirm');
  if (!btn) return;
  const dateInput = document.getElementById('shareExpireDate');
  btn.disabled = !(_shareSelectedOffices.length > 0 && dateInput && dateInput.value);
}

function revokeShare(nodeId, officeId) {
  const reg = shareRegistry[nodeId];
  if (!reg || !reg.shares) return;
  reg.shares = reg.shares.filter(s => s.officeId !== officeId);
  if (!reg.shares.length) delete shareRegistry[nodeId];
  saveShareRegistry();
  refreshUI();
  showToast('\uD83D\uDD12 Akses dicabut', 'success');
}

function saveShare() {
  if (!_shareTargetId || !_shareSelectedOffices.length) return;
  const dateInput = document.getElementById('shareExpireDate');
  if (!dateInput || !dateInput.value) { showToast('\u26A0\uFE0F Pilih tanggal expired', 'error'); return; }
  const expiredAt = new Date(dateInput.value).getTime() + (24 * 60 * 60 * 1000 - 1);
  if (expiredAt <= Date.now()) { showToast('\u26A0\uFE0F Tanggal harus di masa depan', 'error'); return; }
  if (!shareRegistry[_shareTargetId]) {
    shareRegistry[_shareTargetId] = { shares: [], sharedAt: Date.now(), sharedBy: currentUser.name };
  }
  const reg = shareRegistry[_shareTargetId];
  _shareSelectedOffices.forEach(sel => {
    reg.shares = reg.shares.filter(s => s.officeId !== sel.officeId);
    reg.shares.push({ officeId: sel.officeId, expiredAt, sharedAt: Date.now(), sharedBy: currentUser.name });
  });
  saveShareRegistry();
  closeShareModal();
  refreshUI();
  const expStr = new Date(expiredAt).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'});
  showToast('\u2705 Folder dibagikan ke ' + _shareSelectedOffices.length + ' kantor hingga ' + expStr, 'success');
}

// Wire share modal controls
(function wireShareModal() {
  const modal = document.getElementById('shareModal');
  const closeBtn = document.getElementById('shareModalClose');
  const cancelBtn = document.getElementById('shareModalCancel');
  const confirmBtn = document.getElementById('shareModalConfirm');
  const searchInput = document.getElementById('shareSearchInput');
  const dateInput = document.getElementById('shareExpireDate');
  if (closeBtn) closeBtn.addEventListener('click', closeShareModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeShareModal);
  if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) closeShareModal(); });
  if (confirmBtn) confirmBtn.addEventListener('click', saveShare);
  if (searchInput) searchInput.addEventListener('input', function() { _renderShareOfficeList(searchInput.value); });
  if (dateInput) dateInput.addEventListener('change', function() {
    _updateShareConfirmBtn();
    document.querySelectorAll('.share-preset-btn').forEach(b => b.classList.remove('active'));
  });
  document.querySelectorAll('.share-preset-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const days = parseInt(btn.dataset.days);
      const d = new Date();
      d.setDate(d.getDate() + days);
      if (dateInput) { dateInput.value = d.toISOString().split('T')[0]; _updateShareConfirmBtn(); }
      document.querySelectorAll('.share-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeShareModal();
  });
})();

// ================================================
//  LOGOUT
// ================================================
function doLogout() {
  sessionStorage.removeItem('fv_user');
  currentUser = { name: 'User', role: 'super_admin', officeId: null, npp: '', jabatan: '' };
  document.body.classList.remove('view-only-mode');
  const banner = document.getElementById('viewOnlyBanner');
  if (banner) banner.classList.remove('visible');
  const loginOverlayEl = document.getElementById('loginOverlay');
  if (loginOverlayEl) loginOverlayEl.classList.remove('hidden');
  // Reset IHC state
  _ihcEmployees = [];
  _ihcSelected = null;
  const ihcListEl = document.getElementById('ihcEmployeeList');
  if (ihcListEl) { ihcListEl.innerHTML = ''; ihcListEl.classList.remove('visible'); }
  const ihcSearchWrap = document.getElementById('ihcSearchWrap');
  if (ihcSearchWrap) ihcSearchWrap.style.display = 'none';
  const ihcStats = document.getElementById('ihcStats');
  if (ihcStats) ihcStats.style.display = 'none';
  const ihcFileName = document.getElementById('ihcFileName');
  if (ihcFileName) ihcFileName.textContent = 'Belum ada file dipilih';
  // Clear manual fields
  ['loginName','loginNPP','loginJabatan'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset role to super_admin
  const sa = document.querySelector('input[name="loginRole"][value="super_admin"]');
  if (sa) { sa.checked = true; sa.dispatchEvent(new Event('change')); }
  updateUserChip();
}

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) btnLogout.addEventListener('click', doLogout);

// ================================================
//  IHC CSV IMPORT
// ================================================
let _ihcEmployees = [];  // [{npp, name, jabatan}]
let _ihcSelected  = null;

(function wireIHC() {
  const fileInput    = document.getElementById('ihcFileInput');
  const searchWrap   = document.getElementById('ihcSearchWrap');
  const searchInput  = document.getElementById('ihcSearchInput');
  const listEl       = document.getElementById('ihcEmployeeList');
  const statsEl      = document.getElementById('ihcStats');
  const fileNameEl   = document.getElementById('ihcFileName');

  if (!fileInput) return;

  // Parse CSV: support comma or semicolon separator, skip header if first cell is non-numeric
  function parseIHC(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const result = [];
    lines.forEach((line, idx) => {
      const cols = line.split(/[,;]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (!cols.length) return;
      const [npp, name, jabatan] = cols;
      // Skip header line (first line if npp is not numeric-ish)
      if (idx === 0 && !/^\d/.test(npp)) return;
      if (!name) return;
      result.push({ npp: npp || '', name, jabatan: jabatan || '' });
    });
    return result;
  }

  function renderList(query) {
    if (!listEl) return;
    const q = (query || '').toLowerCase().trim();
    const filtered = _ihcEmployees.filter(e =>
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.npp.toLowerCase().includes(q) ||
      (e.jabatan && e.jabatan.toLowerCase().includes(q))
    ).slice(0, 50);

    listEl.innerHTML = '';
    if (!filtered.length) {
      listEl.innerHTML = '<div style="padding:14px;text-align:center;color:#94A3B8;font-size:12px;">Tidak ada hasil</div>';
      listEl.classList.add('visible');
      return;
    }
    filtered.forEach(emp => {
      const isSelected = _ihcSelected && _ihcSelected.npp === emp.npp && _ihcSelected.name === emp.name;
      const item = document.createElement('div');
      item.className = 'ihc-employee-item' + (isSelected ? ' selected' : '');
      item.innerHTML =
        '<span class="ihc-employee-item__npp">' + escapeHtml(emp.npp || '-') + '</span>' +
        '<div class="ihc-employee-item__info">' +
          '<div class="ihc-employee-item__name">' + escapeHtml(emp.name) + '</div>' +
          '<div class="ihc-employee-item__jabatan">' + escapeHtml(emp.jabatan || '') + '</div>' +
        '</div>' +
        '<svg class="ihc-employee-item__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      item.addEventListener('click', () => {
        _ihcSelected = emp;
        // Auto-fill the manual fields
        const nameEl = document.getElementById('loginName');
        const nppEl  = document.getElementById('loginNPP');
        const jabEl  = document.getElementById('loginJabatan');
        if (nameEl) nameEl.value = emp.name;
        if (nppEl)  nppEl.value  = emp.npp;
        if (jabEl)  jabEl.value  = emp.jabatan;
        renderList(searchInput ? searchInput.value : '');
        // Show green feedback
        showToast('\u2705 Data pegawai dipilih: ' + emp.name, 'success');
      });
      listEl.appendChild(item);
    });
    listEl.classList.add('visible');
  }

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    if (fileNameEl) fileNameEl.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
      _ihcEmployees = parseIHC(e.target.result);
      _ihcSelected  = null;
      if (searchWrap) searchWrap.style.display = 'block';
      if (statsEl) {
        statsEl.textContent = '\u2705 ' + _ihcEmployees.length + ' data pegawai berhasil dibaca dari ' + file.name;
        statsEl.style.display = 'block';
      }
      renderList('');
    };
    reader.onerror = function() {
      showToast('\u274c Gagal membaca file CSV', 'error');
    };
    reader.readAsText(file, 'UTF-8');
    // Reset file input so same file can be re-uploaded
    fileInput.value = '';
  });

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderList(searchInput.value);
    });
    searchInput.addEventListener('focus', function() {
      if (_ihcEmployees.length > 0) renderList(searchInput.value);
    });
  }
})();
