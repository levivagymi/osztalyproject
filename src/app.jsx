// Fő app — routing, szűrők, keresés, composer modal és bejegyzés-overlay.

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useCallback: useCallbackA } = React;

function App() {
  const [route, setRoute]       = useStateA({ name: "home" });
  const [posts, setPosts]       = useStateA([]);
  const [topics, setTopics]     = useStateA([]);
  const [filterCat, setFilterC] = useStateA(null);
  const [filterSaved, setFilterSaved] = useStateA(false);
  const [search, setSearch]     = useStateA("");
  const [composerOpen, setCO]   = useStateA(false);
  const [openPost, setOpenPost] = useStateA(null);
  const [editContext, setEditContext] = useStateA(null); // { post, password }
  const [savedPostIds, setSavedPostIds] = useStateA(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ok:saved") || "[]")); }
    catch { return new Set(); }
  });

  // Kezdeti betöltés
  useEffectA(() => {
    (async () => {
      const sb = window.supabase;
      if (!sb) throw new Error("window.supabase is missing");
      if (typeof sb.listTopics !== "function") throw new Error("window.supabase.listTopics is not a function");
      if (typeof sb.listPosts !== "function") throw new Error("window.supabase.listPosts is not a function");
      const [{ data: ts }, { data: ps }] = await Promise.all([
        sb.listTopics(),
        sb.listPosts(),
      ]);
      setTopics(ts || []);
      setPosts(ps || []);
    })();
  }, []);

  // Keresési esemény a fejlécből
  useEffectA(() => {
    const onSearch = (e) => setSearch(e.detail || "");
    window.addEventListener("ok:search", onSearch);
    return () => window.removeEventListener("ok:search", onSearch);
  }, []);

  const postCounts = useMemoA(() => {
    const byCat = {};
    const byTopic = {};
    posts.forEach(p => {
      byCat[p.category]  = (byCat[p.category]  || 0) + 1;
      byTopic[p.team_id] = (byTopic[p.team_id] || 0) + 1;
    });
    return { byCat, byTopic };
  }, [posts]);

  const scrollToFeed = useCallbackA(() => {
    const el = document.getElementById("feed");
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
  }, []);

  const handleToggleSave = useCallbackA((postId) => {
    setSavedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      localStorage.setItem("ok:saved", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Új bejegyzés közzétéve VAGY meglévő módosítva
  function handlePublished(updatedPost, isEdit) {
    if (isEdit) {
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      setOpenPost(prev => prev?.id === updatedPost.id ? updatedPost : prev);
    } else {
      setPosts(prev => [updatedPost, ...prev]);
      setTimeout(() => { scrollToFeed(); setOpenPost(updatedPost); }, 250);
    }
    setCO(false);
    setEditContext(null);
  }

  // Szerkesztés megnyitása jelszóval (PostOverlay hívja)
  function handleOpenEdit(post, password) {
    setEditContext({ post, password });
    setOpenPost(null);
    setCO(true);
  }

  // Törlés (PostOverlay hívja, miután a jelszó ellenőrzése megtörtént)
  function handleDeletePost(postId) {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setSavedPostIds(prev => {
      const next = new Set(prev);
      next.delete(postId);
      localStorage.setItem("ok:saved", JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onCompose={() => { setEditContext(null); setCO(true); }}
        onHome={() => { setRoute({ name: "home" }); setFilterC(null); window.scrollTo(0, 0); }}
        route={route.name}
      />

      <main className="flex-1">
        {route.name === "home" && (
          <>
            <Hero
              onCompose={() => { setEditContext(null); setCO(true); }}
              onScrollToFeed={scrollToFeed}
              stats={{ posts: posts.length, topics: topics.length, cats: CATEGORIES.length }}
            />
            <TeamsGrid
              topics={topics}
              onOpenTeam={(t) => { setRoute({ name: "team", team: t }); window.scrollTo(0, 0); }}
              postCounts={postCounts.byTopic}
            />
            <KnowledgeCloud
              active={filterCat}
              onSelect={(c) => { setFilterC(c); scrollToFeed(); }}
              postCounts={postCounts.byCat}
            />
            <BlogFeed
              posts={posts}
              topics={topics}
              filterCat={filterCat}
              filterTeam={null}
              search={search}
              filterSaved={filterSaved}
              savedPostIds={savedPostIds}
              onToggleFilterSaved={() => setFilterSaved(prev => !prev)}
              onClearFilters={() => { setFilterC(null); setSearch(""); setFilterSaved(false); }}
              onOpenPost={setOpenPost}
            />
          </>
        )}

        {route.name === "team" && (
          <TeamView
            team={route.team}
            posts={posts}
            allTeams={topics}
            onBack={() => setRoute({ name: "home" })}
            onOpenPost={setOpenPost}
          />
        )}
      </main>

      <Footer />

      <Composer
        open={composerOpen}
        onClose={() => { setCO(false); setEditContext(null); }}
        onPublish={handlePublished}
        topics={topics}
        editPost={editContext?.post ?? null}
        editPassword={editContext?.password ?? ""}
      />

      <Tutorial />

      <PostOverlay
        post={openPost}
        topic={openPost ? topics.find(t => t.id === openPost.team_id) : null}
        onClose={() => setOpenPost(null)}
        savedPostIds={savedPostIds}
        onToggleSave={handleToggleSave}
        onEdit={handleOpenEdit}
        onDelete={handleDeletePost}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
