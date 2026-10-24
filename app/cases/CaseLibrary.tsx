"use client";

import { useMemo, useState } from "react";
import { caseFilters, caseLibrary } from "@/data/case-library";

export default function CaseLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("全部");
  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return caseLibrary.filter((item) => {
      const matchesFilter = filter === "全部" || item.tags.includes(filter);
      const content = [item.title, item.customer, item.problem, item.method, item.outcome, item.resultDetail, ...item.tags].join(" ").toLocaleLowerCase();
      return matchesFilter && (!needle || content.includes(needle));
    });
  }, [query, filter]);

  return (
    <div className="library-browser" id="applications">
      <div className="library-toolbar">
        <label className="library-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.2 16.2 4.6 4.6"/></svg>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索行业、问题或方法，如：零售、报价、知识库" aria-label="搜索 AI 应用案例" autoComplete="off" />
        </label>
        <div className="library-filters" role="group" aria-label="按业务场景筛选">
          {caseFilters.map((tag) => <button key={tag} type="button" aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</button>)}
        </div>
      </div>

      <p className="library-results-status" role="status" aria-live="polite">
        {query || filter !== "全部" ? `找到 ${results.length} 个相关场景` : "从业务问题出发，找到适合您的改造方向。"}
      </p>

      <div className="library-list">
        {results.map((item) => (
          <details className="library-item" id={item.id} key={item.id}>
            <summary className="library-summary">
              <span className="library-number" aria-hidden="true">{item.id.slice(1)}</span>
              <div className="library-card-intro">
                <div className="library-kicker"><span>{item.tags.join(" / ")}</span><span className="library-stage" data-stage={item.stage}>{item.status}</span></div>
                <h3>{item.title}</h3>
                <p className="library-method">{item.method}</p>
              </div>
              <p className="library-outcome">{item.outcome}</p>
              <span className="library-chevron" aria-hidden="true">+</span>
            </summary>
            <div className="library-detail">
              <div className="library-detail-block"><span>服务场景</span><h4>{item.customer}</h4></div>
              <div className="library-detail-block"><span>业务问题</span><p>{item.problem}</p></div>
              <div className="library-detail-block"><span>解决方法</span><p>{item.method}</p></div>
              <div className="library-detail-block"><span>成效与变化</span><p>{item.resultDetail}</p></div>
              <p className="library-boundary"><span>适用边界</span>{item.boundary}</p>
              <a className="library-detail-link" href="/#contact">探讨我的业务场景 <span aria-hidden="true">↗</span></a>
            </div>
          </details>
        ))}
      </div>

      {results.length === 0 && <div className="library-empty"><h3>暂时没有匹配的案例</h3><p>换一个行业或业务关键词，也可以直接和我们聊聊您的问题。</p><button type="button" onClick={() => { setQuery(""); setFilter("全部"); }}>查看全部场景</button></div>}
    </div>
  );
}
