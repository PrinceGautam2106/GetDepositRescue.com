<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Deposit Rescue</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          :root {
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --primary: #0284c7;
            --primary-dark: #0369a1;
            --border: #e2e8f0;
            --badge-green: #dcfce7;
            --badge-green-text: #15803d;
            --badge-blue: #e0f2fe;
            --badge-blue-text: #0369a1;
            --badge-gray: #f1f5f9;
            --badge-gray-text: #475569;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            padding: 32px 16px;
            line-height: 1.5;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          }

          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 12px;
          }

          .brand-title {
            font-size: 24px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ffffff;
            text-decoration: none;
          }

          .brand-badge {
            background-color: #38bdf8;
            color: #0f172a;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 6px;
            letter-spacing: 0.05em;
          }

          .header-desc {
            color: #cbd5e1;
            font-size: 14px;
            max-width: 780px;
            line-height: 1.6;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .stat-item {
            display: flex;
            flex-direction: column;
          }

          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
          }

          .stat-label {
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 16px;
          }

          .search-box {
            position: relative;
            flex: 1;
            max-width: 400px;
          }

          .search-input {
            width: 100%;
            padding: 10px 16px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            background-color: var(--card-bg);
            color: var(--text-main);
            outline: none;
            transition: all 0.2s ease;
          }

          .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
          }

          .table-card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
          }

          thead {
            background-color: #f1f5f9;
            border-bottom: 1px solid var(--border);
          }

          th {
            padding: 14px 16px;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }

          tbody tr {
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.15s ease;
          }

          tbody tr:hover {
            background-color: #f8fafc;
          }

          tbody tr:last-child {
            border-bottom: none;
          }

          td {
            padding: 12px 16px;
            vertical-align: middle;
          }

          .url-cell {
            font-weight: 500;
            max-width: 480px;
            word-break: break-all;
          }

          .url-link {
            color: var(--primary-dark);
            text-decoration: none;
          }

          .url-link:hover {
            text-decoration: underline;
            color: var(--primary);
          }

          .badge {
            display: inline-flex;
            align-items: center;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
          }

          .badge-high {
            background-color: var(--badge-green);
            color: var(--badge-green-text);
          }

          .badge-med {
            background-color: var(--badge-blue);
            color: var(--badge-blue-text);
          }

          .badge-low {
            background-color: var(--badge-gray);
            color: var(--badge-gray-text);
          }

          .date-cell {
            color: var(--text-muted);
            white-space: nowrap;
          }

          .langs {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
          }

          .lang-pill {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            background: #f1f5f9;
            color: #475569;
            font-weight: 600;
            text-decoration: none;
          }

          .lang-pill:hover {
            background: #e2e8f0;
          }

          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 13px;
            color: var(--text-muted);
          }

          .footer a {
            color: var(--primary);
            text-decoration: none;
          }

          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-top">
              <a href="https://getdepositrescue.com" class="brand-title">
                <span>Deposit Rescue</span>
                <span class="brand-badge">XML Sitemap</span>
              </a>
            </div>
            <p class="header-desc">
              This is the official search engine XML sitemap for <strong>getdepositrescue.com</strong>.
              It lists the authoritative pages, state-specific security deposit law guides, and tools indexed by search engines like Google, Bing, and DuckDuckGo.
            </p>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">
                  <xsl:choose>
                    <xsl:when test="sitemap:sitemapindex">
                      <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> Sub-Sitemaps
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
                    </xsl:otherwise>
                  </xsl:choose>
                </span>
                <span class="stat-label">Total Index Entries</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">50 States + DC</span>
                <span class="stat-label">Legal Coverage (EN / ES)</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">Google / Bing</span>
                <span class="stat-label">Crawler Optimized</span>
              </div>
            </div>
          </div>

          <div class="toolbar">
            <div class="search-box">
              <input type="text" id="searchInput" class="search-input" placeholder="Filter URLs (e.g., california, calculator, es)..." onkeyup="filterTable()" />
            </div>
            <div style="font-size: 13px; color: #64748b;">
              Showing <span id="visibleCount"><xsl:value-of select="count(sitemap:urlset/sitemap:url | sitemap:sitemapindex/sitemap:sitemap)"/></span> entries
            </div>
          </div>

          <div class="table-card">
            <!-- SITEMAP INDEX VIEW -->
            <xsl:if test="sitemap:sitemapindex">
              <table id="sitemapTable">
                <thead>
                  <tr>
                    <th style="width: 50px;">#</th>
                    <th>Sitemap URL</th>
                    <th style="width: 200px;">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td style="color: #94a3b8;"><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <a class="url-link" href="{sitemap:loc}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td class="date-cell">
                        <xsl:choose>
                          <xsl:when test="sitemap:lastmod">
                            <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:if>

            <!-- URLSET VIEW -->
            <xsl:if test="sitemap:urlset">
              <table id="sitemapTable">
                <thead>
                  <tr>
                    <th style="width: 50px;">#</th>
                    <th>Page URL</th>
                    <th style="width: 110px;">Priority</th>
                    <th style="width: 120px;">Change Freq</th>
                    <th style="width: 140px;">Last Modified</th>
                    <th style="width: 140px;">Languages</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td style="color: #94a3b8;"><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <a class="url-link" href="{sitemap:loc}" target="_blank" rel="noopener">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:variable name="p" select="sitemap:priority"/>
                        <xsl:choose>
                          <xsl:when test="$p &gt;= 0.9">
                            <span class="badge badge-high"><xsl:value-of select="concat(format-number($p * 100, '0'), '%')"/></span>
                          </xsl:when>
                          <xsl:when test="$p &gt;= 0.7">
                            <span class="badge badge-med"><xsl:value-of select="concat(format-number($p * 100, '0'), '%')"/></span>
                          </xsl:when>
                          <xsl:when test="$p">
                            <span class="badge badge-low"><xsl:value-of select="concat(format-number($p * 100, '0'), '%')"/></span>
                          </xsl:when>
                          <xsl:otherwise>
                            <span class="badge badge-low">Default</span>
                          </xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td>
                        <span style="color: #475569; text-transform: capitalize; font-weight: 500;">
                          <xsl:choose>
                            <xsl:when test="sitemap:changefreq"><xsl:value-of select="sitemap:changefreq"/></xsl:when>
                            <xsl:otherwise>weekly</xsl:otherwise>
                          </xsl:choose>
                        </span>
                      </td>
                      <td class="date-cell">
                        <xsl:choose>
                          <xsl:when test="sitemap:lastmod">
                            <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                          </xsl:when>
                          <xsl:otherwise>-</xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td>
                        <div class="langs">
                          <xsl:for-each select="xhtml:link[@rel='alternate']">
                            <a class="lang-pill" href="{@href}" title="{@hreflang}">
                              <xsl:value-of select="@hreflang"/>
                            </a>
                          </xsl:for-each>
                        </div>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:if>
          </div>

          <div class="footer">
            <p>Generated by <a href="https://getdepositrescue.com">Deposit Rescue</a> &#8226; <a href="https://getdepositrescue.com/robots.txt">robots.txt</a> &#8226; <a href="https://getdepositrescue.com/sitemap-index.xml">sitemap-index.xml</a></p>
          </div>
        </div>

        <script type="text/javascript">
          function filterTable() {
            var input = document.getElementById("searchInput");
            var filter = input.value.toLowerCase();
            var table = document.getElementById("sitemapTable");
            var tr = table.getElementsByTagName("tr");
            var visibleCount = 0;

            for (var i = 1; i &lt; tr.length; i++) {
              var text = tr[i].textContent || tr[i].innerText;
              if (text.toLowerCase().indexOf(filter) &gt; -1) {
                tr[i].style.display = "";
                visibleCount++;
              } else {
                tr[i].style.display = "none";
              }
            }
            var countEl = document.getElementById("visibleCount");
            if (countEl) countEl.innerText = visibleCount;
          }
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
