// ─────────────────────────────────────────────────────────────────────
// Supabase kliens — valódi integráció
// ─────────────────────────────────────────────────────────────────────
//
// BEÁLLÍTÁS (egyszeri):
//   1. Nyisd meg a config.js fájlt (a projekt gyökerében)
//   2. Töltsd ki a Supabase URL-t és az anon kulcsot:
//        Supabase → Settings → API → Project URL + anon public key
//   3. Futtasd le a schema.sql tartalmát a Supabase SQL Editor-ban
//
// A config.js .gitignore-ban van → a kulcsok nem kerülnek git-be.
// ─────────────────────────────────────────────────────────────────────

const { url: SUPABASE_URL, key: SUPABASE_KEY } = window.SUPABASE_CONFIG;

const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// A jelszó mezőt nem adjuk vissza normál lekérdezéseknél
const SAFE_COLS = "id,title,excerpt,content,team_id,category,tags,image_url,pinned,read_min,author,created_at,updated_at";

// DB → frontend mezőátalakítás
function toFrontend(row) {
  if (!row) return null;
  return {
    ...row,
    read:  row.read_min ?? 3,
    image: row.image_url ? { kind: "photo", label: row.image_url } : null,
  };
}

// Frontend → DB mezőátalakítás (jelszó nélkül)
function toDb(payload) {
  const wordCount = (payload.content || "").trim().split(/\s+/).filter(Boolean).length;
  return {
    title:     payload.title?.trim(),
    team_id:   payload.team_id,
    category:  payload.category,
    tags:      payload.tags   || [],
    content:   payload.content || "",
    excerpt:   payload.excerpt || "",
    image_url: payload.image?.label || null,
    read_min:  Math.max(1, Math.round(wordCount / 200)),
  };
}

const supabase = {
  // Témakörök — helyi adatból
  async listTopics() {
    return { data: TOPICS, error: null };
  },

  // Bejegyzések lekérése (jelszó nélkül)
  async listPosts({ category = null, topicId = null, search = "" } = {}) {
    let query = _sb
      .from("posts")
      .select(SAFE_COLS)
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (topicId)  query = query.eq("team_id", topicId);

    const { data, error } = await query;
    if (error) return { data: [], error };

    let rows = (data || []).map(toFrontend);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q)
      );
    }

    return { data: rows, error: null };
  },

  // Új bejegyzés létrehozása (jelszó kötelező)
  async createPost(payload) {
    if (!payload.title?.trim() || !payload.team_id || !payload.category) {
      return { data: null, error: { message: "Cím, témakör és kategória megadása kötelező." } };
    }
    if (!payload.password?.trim()) {
      return { data: null, error: { message: "A bejegyzéshez jelszó megadása kötelező." } };
    }

    const { data, error } = await _sb
      .from("posts")
      .insert({ ...toDb(payload), password: payload.password.trim() })
      .select(SAFE_COLS)
      .single();

    if (error) return { data: null, error };
    return { data: toFrontend(data), error: null };
  },

  // Jelszó ellenőrzése (szerkesztés/törlés előtt)
  async checkPassword(id, password) {
    const { data, error } = await _sb
      .from("posts")
      .select("id")
      .eq("id", id)
      .eq("password", password)
      .single();
    if (error || !data) return { data: null, error: { message: "Helytelen jelszó." } };
    return { data, error: null };
  },

  // Bejegyzés frissítése — jelszó szükséges
  async updatePost(id, password, patch) {
    const { error: authErr } = await this.checkPassword(id, password);
    if (authErr) return { data: null, error: authErr };

    const { data, error } = await _sb
      .from("posts")
      .update(toDb(patch))
      .eq("id", id)
      .select(SAFE_COLS)
      .single();

    if (error) return { data: null, error };
    return { data: toFrontend(data), error: null };
  },

  // Bejegyzés törlése — jelszó szükséges
  async deletePost(id, password) {
    const { error: authErr } = await this.checkPassword(id, password);
    if (authErr) return { data: null, error: authErr };

    const { error } = await _sb.from("posts").delete().eq("id", id);
    if (error) return { data: null, error };
    return { data: { id }, error: null };
  },

  // Megjegyzések lekérése egy bejegyzéshez
  async listComments(postId) {
    const { data, error } = await _sb
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    return { data: data || [], error };
  },

  // Megjegyzés hozzáadása
  async addComment({ post_id, author, body }) {
    const { data, error } = await _sb
      .from("post_comments")
      .insert({ post_id, author, body })
      .select()
      .single();
    return { data, error };
  },

  // Kép feltöltése Supabase Storage-ba (bucket: "post-images", public)
  async uploadImage(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await _sb.storage
      .from("post-images")
      .upload(name, file, { upsert: false });
    if (error) return { url: null, error };
    const { data: { publicUrl } } = _sb.storage.from("post-images").getPublicUrl(data.path);
    return { url: publicUrl, error: null };
  },
};

Object.assign(window, { supabase });
