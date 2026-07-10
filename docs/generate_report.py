#!/usr/bin/env python3
"""
Generate a professional technical project report PDF for 'Global Jersey Store'.
Uses reportlab with custom styles, cover page, table of contents, and structured sections.
"""

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem, Flowable
)
from reportlab.pdfgen import canvas

# ---------------------------------------------------------------------------
# Color Scheme
# ---------------------------------------------------------------------------
NAVY = HexColor("#1a1a2e")
ACCENT = HexColor("#e63946")
LIGHT_GRAY = HexColor("#f1f3f5")
MEDIUM_GRAY = HexColor("#868e96")
DARK_GRAY = HexColor("#343a40")
SECTION_BG = HexColor("#16213e")
ACCENT_LIGHT = HexColor("#fdeaea")
LINE_GRAY = HexColor("#dee2e6")
GREEN_LIGHT = HexColor("#e8f5e9")
ROW_ALT = HexColor("#f7f8fa")
BODY_COLOR = HexColor("#212529")

OUTPUT_PATH = "/app/projects/global-jersey-store/docs/Global-Jersey-Store-Report.pdf"

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=34, leading=42, alignment=TA_CENTER, textColor=white, spaceAfter=6,
)

style_subtitle = ParagraphStyle(
    "CoverSubtitle", parent=styles["Title"], fontName="Helvetica",
    fontSize=18, leading=24, alignment=TA_CENTER, textColor=ACCENT, spaceAfter=30,
)

style_cover_tagline = ParagraphStyle(
    "CoverTagline", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=13, leading=18, alignment=TA_CENTER, textColor=HexColor("#c5c6c7"), spaceAfter=6,
)

style_toc_title = ParagraphStyle(
    "TOCTitle", fontName="Helvetica-Bold", fontSize=22, leading=28,
    alignment=TA_LEFT, textColor=NAVY, spaceAfter=20,
)

style_h1 = ParagraphStyle(
    "H1", fontName="Helvetica-Bold", fontSize=18, leading=24, alignment=TA_LEFT,
    textColor=NAVY, spaceBefore=18, spaceAfter=12, keepWithNext=True,
)

style_h2 = ParagraphStyle(
    "H2", fontName="Helvetica-Bold", fontSize=14, leading=20, alignment=TA_LEFT,
    textColor=ACCENT, spaceBefore=14, spaceAfter=8, keepWithNext=True,
)

style_body = ParagraphStyle(
    "Body", fontName="Helvetica", fontSize=10.5, leading=16, alignment=TA_JUSTIFY,
    textColor=BODY_COLOR, spaceAfter=8,
)

style_bullet = ParagraphStyle(
    "Bullet", fontName="Helvetica", fontSize=10.5, leading=15, alignment=TA_LEFT,
    textColor=BODY_COLOR, spaceAfter=4,
)

style_toc_entry = ParagraphStyle(
    "TOCEntry", fontName="Helvetica", fontSize=11, leading=20, textColor=BODY_COLOR,
)

style_toc_entry_sub = ParagraphStyle(
    "TOCEntrySub", fontName="Helvetica", fontSize=10, leading=18, textColor=DARK_GRAY,
    leftIndent=24,
)

# ---------------------------------------------------------------------------
# Custom Flowable
# ---------------------------------------------------------------------------
class SectionDivider(Flowable):
    """A colored divider line for sections."""
    def __init__(self, width=450, thickness=1.2, color=None):
        Flowable.__init__(self)
        self.width = width
        self.thickness = thickness
        self.color = color or ACCENT

    def wrap(self, availWidth, availHeight):
        return (self.width, self.thickness + 2)

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 0, self.width, 0)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def make_bullet_list(items, style=None):
    if style is None:
        style = style_bullet
    list_items = []
    for item in items:
        list_items.append(ListItem(Paragraph(item, style), leftIndent=18, bulletColor=ACCENT))
    return ListFlowable(
        list_items, bulletType="bullet", start="•", bulletColor=ACCENT,
        bulletFontSize=8, leftIndent=18, spaceBefore=2, spaceAfter=8,
    )

def tech_table(rows):
    data = []
    for label, desc in rows:
        data.append([
            Paragraph(f'<b>{label}</b>', ParagraphStyle("TL", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=NAVY)),
            Paragraph(desc, ParagraphStyle("TD", fontName="Helvetica", fontSize=10, leading=14, textColor=BODY_COLOR)),
        ])
    tbl = Table(data, colWidths=[1.85 * inch, 4.65 * inch])
    tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE_GRAY),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, ROW_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
    ]))
    return tbl

def feature_block(number, title, bullets, story):
    story.append(Paragraph(f"{number} {title}", style_h2))
    story.append(SectionDivider(width=460, thickness=1, color=ACCENT))
    story.append(Spacer(1, 6))
    story.append(make_bullet_list(bullets))
    story.append(Spacer(1, 4))


# ---------------------------------------------------------------------------
# Page callbacks
# ---------------------------------------------------------------------------
def on_first_page(canvas_obj, doc_obj):
    """Draw cover page background and decorations."""
    c = canvas_obj
    w, h = LETTER
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(0, h - 6, w, 6, fill=1, stroke=0)
    c.rect(0, 0, w, 4, fill=1, stroke=0)
    # Shield logo
    shield_cx = w / 2
    shield_cy = h - 135
    shield_w = 62
    shield_h = 78
    c.setFillColor(ACCENT)
    c.setStrokeColor(white)
    c.setLineWidth(2.5)
    p = c.beginPath()
    p.moveTo(shield_cx - shield_w / 2, shield_cy + shield_h / 2)
    p.lineTo(shield_cx + shield_w / 2, shield_cy + shield_h / 2)
    p.lineTo(shield_cx + shield_w / 2, shield_cy - shield_h / 5)
    p.lineTo(shield_cx, shield_cy - shield_h / 2)
    p.lineTo(shield_cx - shield_w / 2, shield_cy - shield_h / 5)
    p.close()
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(shield_cx, shield_cy - 3, "GJS")
    c.restoreState()

def on_later_pages(canvas_obj, doc_obj):
    """Draw header and footer for content pages."""
    c = canvas_obj
    w, h = LETTER
    c.saveState()
    c.setStrokeColor(ACCENT)
    c.setLineWidth(2)
    c.line(0.9 * inch, h - 0.62 * inch, w - 0.9 * inch, h - 0.62 * inch)
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(NAVY)
    c.drawString(0.9 * inch, h - 0.78 * inch, "Global Jersey Store — Technical Project Report")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MEDIUM_GRAY)
    c.drawRightString(w - 0.9 * inch, h - 0.78 * inch, "Nossaiba El Asri")
    c.setStrokeColor(LINE_GRAY)
    c.setLineWidth(0.6)
    c.line(0.9 * inch, 0.62 * inch, w - 0.9 * inch, 0.62 * inch)
    c.setFont("Helvetica", 8)
    c.setFillColor(MEDIUM_GRAY)
    c.drawString(0.9 * inch, 0.44 * inch, "Global Jersey Store — E-Commerce Web Application")
    c.drawCentredString(w / 2, 0.44 * inch, "July 2026")
    c.drawRightString(w - 0.9 * inch, 0.44 * inch, f"Page {doc_obj.page - 1}")
    c.restoreState()


# ---------------------------------------------------------------------------
# Build the story
# ---------------------------------------------------------------------------
def build_story():
    story = []

    # ===================================================================
    # 1. COVER PAGE
    # ===================================================================
    story.append(Spacer(1, 2.3 * inch))
    story.append(Paragraph("Global Jersey Store", style_title))
    story.append(Spacer(1, 4))
    story.append(Paragraph("E-Commerce Web Application", ParagraphStyle(
        "CT2", parent=style_title, fontSize=20, leading=26, textColor=white)))
    story.append(Spacer(1, 18))
    story.append(Paragraph("Technical Project Report", style_subtitle))
    story.append(Spacer(1, 0.8 * inch))
    story.append(Paragraph("A full-featured international football jersey e-commerce platform", style_cover_tagline))
    story.append(Spacer(1, 1.2 * inch))

    author_table = Table([
        [Paragraph("Author", ParagraphStyle("CL", fontName="Helvetica", fontSize=9, textColor=MEDIUM_GRAY, alignment=TA_CENTER))],
        [Paragraph("Nossaiba El Asri", ParagraphStyle("CV", fontName="Helvetica-Bold", fontSize=14, textColor=white, alignment=TA_CENTER))],
        [Spacer(1, 8)],
        [Paragraph("Date", ParagraphStyle("CL2", fontName="Helvetica", fontSize=9, textColor=MEDIUM_GRAY, alignment=TA_CENTER))],
        [Paragraph("July 2026", ParagraphStyle("CV2", fontName="Helvetica-Bold", fontSize=13, textColor=white, alignment=TA_CENTER))],
        [Spacer(1, 8)],
        [Paragraph("Portfolio Project", ParagraphStyle("CL3", fontName="Helvetica-Oblique", fontSize=10, textColor=ACCENT, alignment=TA_CENTER))],
    ], colWidths=[4 * inch])
    author_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(author_table)
    story.append(PageBreak())

    # ===================================================================
    # 2. TABLE OF CONTENTS
    # ===================================================================
    story.append(Paragraph("Table of Contents", style_toc_title))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 14))

    toc_entries = [
        ("1.  Project Overview", None),
        ("2.  Technologies Used", None),
        ("3.  Architecture", None),
        ("4.  Key Features", "main"),
        ("      4.1  Product Catalog", "sub"),
        ("      4.2  Product Pages", "sub"),
        ("      4.3  Shopping Cart", "sub"),
        ("      4.4  Checkout System", "sub"),
        ("      4.5  Order Management (My Account)", "sub"),
        ("      4.6  Authentication", "sub"),
        ("      4.7  Wishlist", "sub"),
        ("      4.8  UI/UX Design", "sub"),
        ("      4.9  Admin Dashboard", "sub"),
        ("5.  Data Storage Explanation", None),
        ("6.  Deployment & DevOps", None),
        ("7.  Challenges & Solutions", None),
        ("8.  Skills Demonstrated", None),
        ("9.  Future Improvements", None),
        ("10. Conclusion", None),
    ]
    for entry, level in toc_entries:
        if level is None:
            story.append(Paragraph(entry, style_toc_entry))
        elif level == "sub":
            story.append(Paragraph(entry, style_toc_entry_sub))
    story.append(PageBreak())

    # ===================================================================
    # 3. PROJECT OVERVIEW (Section 1)
    # ===================================================================
    story.append(Paragraph("1.  Project Overview", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "Global Jersey Store is a full-featured e-commerce web application built as a portfolio project "
        "to demonstrate full-stack web development skills using modern, industry-standard technologies. "
        "The platform allows users to browse, search, and purchase international football jerseys from "
        "national teams around the world, featuring a complete shopping experience from product discovery "
        "through checkout and order management.", style_body))

    overview_rows = [
        ("Purpose", "Portfolio project demonstrating full-stack web development skills — from responsive UI "
                    "design to authentication, state management, and CI/CD deployment workflows."),
        ("Target Audience", "Football fans worldwide and jersey collectors seeking national team jerseys in a "
                            "clean, modern online store."),
        ("Project Type", "E-commerce web application (portfolio / demo) — fully functional front-end with "
                         "simulated checkout and order processing."),
        ("Live URL", '<font color="#e63946"><b>https://global-jersey-store.vercel.app</b></font>'),
        ("GitHub", '<font color="#e63946"><b>https://github.com/nossaiba-elas/global-jersey-store</b></font>'),
    ]
    data = []
    for label, desc in overview_rows:
        data.append([
            Paragraph(f'<b>{label}</b>', ParagraphStyle("OL", fontName="Helvetica-Bold", fontSize=10.5, leading=16, textColor=white)),
            Paragraph(desc, ParagraphStyle("OD", fontName="Helvetica", fontSize=10.5, leading=16, textColor=BODY_COLOR)),
        ])
    tbl = Table(data, colWidths=[1.5 * inch, 5.0 * inch])
    tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), SECTION_BG),
        ("ROWBACKGROUNDS", (1, 0), (1, -1), [white, ROW_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE_GRAY),
    ]))
    story.append(tbl)
    story.append(PageBreak())

    # ===================================================================
    # 4. TECHNOLOGIES USED (Section 2)
    # ===================================================================
    story.append(Paragraph("2.  Technologies Used", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "The project is built with a carefully selected stack of modern web technologies. Each technology "
        "was chosen for its industry relevance, developer experience, and suitability for a portfolio-grade "
        "e-commerce application. Below is a summary of every technology used and its role in the project.",
        style_body))
    story.append(Spacer(1, 6))

    tech_rows = [
        ("Frontend Framework", "Next.js 15 — React-based framework with the App Router, enabling file-based routing, "
                                "server/client components, and optimized performance out of the box."),
        ("Language", "TypeScript — strongly typed JavaScript that reduces runtime errors, improves developer "
                      "productivity through autocomplete, and makes refactoring safer."),
        ("Styling", "Tailwind CSS — utility-first CSS framework enabling rapid, consistent, and maintainable "
                     "responsive styling without writing custom CSS files."),
        ("UI Components", "@base-ui/react + shadcn/ui conventions — accessible, composable component primitives "
                           "following the popular shadcn/ui design system patterns."),
        ("Icons", "Lucide React — a clean, consistent, open-source icon set providing SVG icons throughout the UI."),
        ("State Management", "Zustand with localStorage persistence — a lightweight, hook-based store for cart, "
                              "wishlist, and orders, persisted across browser sessions via middleware."),
        ("Authentication", "Firebase Authentication — Google OAuth 2.0 sign-in providing secure, managed user "
                            "identity without building a custom auth backend."),
        ("Form Validation", "Zod + React Hook Form — schema-based validation integrated with performant form "
                             "state management for the checkout shipping form."),
        ("Deployment", "Vercel — the platform behind Next.js, providing automatic CI/CD from GitHub, edge "
                        "network distribution, and zero-downtime deployments."),
        ("Version Control", "Git + GitHub — distributed version control with a remote repository as the single "
                             "source of truth for all project code."),
        ("CI/CD Pipeline", "GitHub Actions — automated workflows running ESLint linting and Next.js build checks "
                            "on every push, ensuring code quality before deployment."),
    ]
    story.append(tech_table(tech_rows))
    story.append(PageBreak())

    # ===================================================================
    # 5. ARCHITECTURE (Section 3)
    # ===================================================================
    story.append(Paragraph("3.  Architecture", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.1  Overview", style_h2))
    story.append(Paragraph(
        "Global Jersey Store follows a modern front-end-centric architecture built on the Next.js App Router. "
        "The application is purely client-side with no custom backend server — Firebase is used solely for "
        "authentication, and all product, cart, wishlist, and order data is managed either as static TypeScript "
        "constants or in browser-side state persisted to localStorage. This architectural decision keeps the "
        "stack intentionally simple, making the project easy to deploy and maintain as a portfolio demo while "
        "still showcasing real-world e-commerce functionality.", style_body))

    story.append(Paragraph("3.2  Architecture at a Glance", style_h2))
    arch_items = [
        "<b>Next.js App Router</b> — file-based routing where each folder under <font face='Courier'>app/</font> maps to a URL segment. "
        "Pages, layouts, and nested routes are defined by convention (page.tsx, layout.tsx).",
        "<b>Client-side state with Zustand</b> — a single store (or small set of stores) manages cart, wishlist, and "
        "orders using React hooks, with Zustand's <i>persist</i> middleware automatically syncing to localStorage.",
        "<b>Static product data</b> — all jersey products and team metadata are defined as typed TypeScript constants in "
        "<font face='Courier'>products.ts</font> and <font face='Courier'>teams.ts</font>, imported directly into components.",
        "<b>Firebase for authentication only</b> — Firebase Authentication handles Google OAuth sign-in. No Firestore or "
        "Realtime Database is used; Firebase is not a data store in this project.",
        "<b>No backend server</b> — the application is purely a frontend deployed as static/server-rendered pages on Vercel. "
        "There is no Express, NestJS, or custom API layer.",
    ]
    story.append(make_bullet_list(arch_items))

    story.append(Paragraph("3.3  Why This Architecture?", style_h2))
    story.append(Paragraph(
        "For a portfolio demo, the priority is to demonstrate the widest range of modern development skills — "
        "responsive UI, state management, authentication, routing, form validation, CI/CD — without the "
        "operational complexity of a full backend with a managed database. By using static product data and "
        "localStorage-backed state, the project avoids the need to provision, configure, and maintain a separate "
        "database server and API, keeping deployment as simple as a git push. This lets the focus remain on "
        "building a polished, feature-rich frontend that works reliably for visitors and reviewers. In a "
        "production setting, the architecture would evolve to include a real database and backend API (see "
        "Section 9: Future Improvements).", style_body))

    story.append(Spacer(1, 8))
    story.append(Paragraph("3.4  High-Level Data Flow", style_h2))
    diag_data = [
        ["Browser (Client)", "→", "Next.js App Router (Pages & Layouts)"],
        ["", "→", "Zustand Store (Cart / Wishlist / Orders)"],
        ["", "→", "localStorage (Persistence via Zustand persist)"],
        ["", "→", "Firebase Authentication (Google OAuth)"],
        ["", "→", "Static TS Constants (products.ts / teams.ts)"],
    ]
    diag_tbl = Table(diag_data, colWidths=[2.0 * inch, 0.4 * inch, 4.1 * inch])
    diag_tbl.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 0), (0, -1), white),
        ("BACKGROUND", (0, 0), (0, -1), NAVY),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("TEXTCOLOR", (1, 0), (1, -1), ACCENT),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (2, 0), (2, -1), ROW_ALT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE_GRAY),
    ]))
    story.append(diag_tbl)
    story.append(PageBreak())

    # ===================================================================
    # 6. KEY FEATURES (Section 4)
    # ===================================================================
    story.append(Paragraph("4.  Key Features", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "Global Jersey Store implements a comprehensive set of e-commerce features that together form a "
        "complete shopping experience. The following subsections detail each feature area, the functionality "
        "it provides, and the technical approach behind it.", style_body))
    story.append(Spacer(1, 6))

    feature_block("4.1", "Product Catalog", [
        "50+ international football jerseys from national teams across multiple continents and confederations.",
        "Filtering by team, league, price range, and size — allowing users to quickly narrow down to jerseys "
        "matching their preferences.",
        "Search functionality enabling users to find jerseys by name, team, or keyword.",
        "Sorting options including price (low to high / high to low), name (alphabetical), and trending "
        "(popularity-based ordering).",
    ], story)

    feature_block("4.2", "Product Pages", [
        "Detailed individual product view displaying high-quality jersey imagery, team information, and pricing.",
        "Interactive size selection with visual size buttons and availability indicators.",
        "Related products section showing jerseys from the same team or category to encourage browsing.",
        "Add to cart and add to wishlist actions available directly from the product page.",
    ], story)

    feature_block("4.3", "Shopping Cart", [
        "Add and remove items dynamically, with instant visual feedback on cart count and total.",
        "Update item quantities with increment/decrement controls and automatic price recalculation.",
        "Real-time price calculation including subtotal, shipping, and tax updates as items change.",
        "Free shipping threshold displayed and applied automatically when the order subtotal reaches $75 or more.",
    ], story)

    feature_block("4.4", "Checkout System", [
        "Multi-field shipping form with client-side validation using Zod schemas integrated with React Hook Form "
        "for robust, type-safe form handling.",
        "Order confirmation page displaying a unique order number in the format <font face='Courier'>GJS-2026-XXXXXX</font>.",
        "Estimated delivery date calculated and presented to the user upon order completion.",
        "Tax calculation at a flat 8% rate applied to the order subtotal, with a full price breakdown shown.",
    ], story)

    feature_block("4.5", "Order Management (My Account)", [
        "Full order history accessible from the user's account page, listing all past orders chronologically.",
        "Expandable detail cards for each order, revealing items purchased, sizes, and quantities.",
        "Complete price breakdown per order — subtotal, shipping, tax, and total — visible in the expanded view.",
        "Shipping address stored and displayed per order for reference.",
        "Order status tracking with clear labels: Confirmed, Processing, Shipped, and Delivered.",
    ], story)

    feature_block("4.6", "Authentication", [
        "Google Sign-In via Firebase OAuth 2.0 — one-click secure authentication with a trusted provider.",
        "Protected profile and orders page accessible only to authenticated users.",
        "Auto-fill of the checkout shipping form with the signed-in user's name and email, reducing friction.",
        "Session persistence so users remain logged in across page reloads and browser sessions.",
    ], story)

    feature_block("4.7", "Wishlist", [
        "Save favorite products to a personal wishlist with a single click from product cards or pages.",
        "Wishlist items persist across sessions via localStorage, so saved jerseys remain on return visits.",
        "View all saved jerseys in a dedicated section within the user profile area.",
        "Easily move items from wishlist to cart when ready to purchase.",
    ], story)

    feature_block("4.8", "UI/UX Design", [
        "Dark / light theme toggle allowing users to switch between a premium dark aesthetic and a clean light mode.",
        "Mobile-first responsive design ensuring the store looks and functions well on phones, tablets, and desktops.",
        "Premium dark aesthetic inspired by World Soccer Shop, with a sophisticated navy and red color palette.",
        "Shield-style logo (GJS) reinforcing the football / sports identity of the brand.",
        "Smooth animations and hover effects throughout for a polished, modern feel.",
        "Product badges including 'Trending', 'Out of Stock', and 'Sale' to communicate product status at a glance.",
    ], story)

    feature_block("4.9", "Admin Dashboard", [
        "Overview dashboard providing a summary of orders and products in one centralized view.",
        "Accessible at the <font face='Courier'>/admin</font> route with role-based access control.",
        "Designed as a foundation for future expansion into full administrative CRUD operations.",
    ], story)
    story.append(PageBreak())

    # ===================================================================
    # 7. DATA STORAGE EXPLANATION (Section 5)
    # ===================================================================
    story.append(Paragraph("5.  Data Storage Explanation", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "A key architectural decision in this project is the intentional absence of a traditional database. "
        "This section explains what data the application manages, where each type of data is stored, and the "
        "rationale and limitations behind this approach.", style_body))

    story.append(Paragraph("5.1  What Data Exists and Where It Lives", style_h2))

    data_storage_rows = [
        ("Products & Teams", "Hardcoded TS constants", "Defined in <font face='Courier'>products.ts</font> and "
            "<font face='Courier'>teams.ts</font> — typed static data imported directly into components at build time."),
        ("Cart", "Browser localStorage", "Managed by a Zustand store with persist middleware; survives page reloads "
            "and browser restarts on the same device."),
        ("Wishlist", "Browser localStorage", "Persisted alongside cart via Zustand; saved jerseys remain across sessions."),
        ("Orders", "Browser localStorage", "Completed orders are stored locally with full detail (items, sizes, "
            "quantities, pricing, address, status) for the order history view."),
        ("User Identity", "Firebase Authentication", "Google OAuth user accounts are managed entirely by Firebase; "
            "no user profile data is stored in the app itself."),
    ]
    ds_data = []
    for dtype, storage, detail in data_storage_rows:
        ds_data.append([
            Paragraph(f'<b>{dtype}</b>', ParagraphStyle("DS1", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=NAVY)),
            Paragraph(f'<b>{storage}</b>', ParagraphStyle("DS2", fontName="Helvetica-Bold", fontSize=9.5, leading=13, textColor=ACCENT)),
            Paragraph(detail, ParagraphStyle("DS3", fontName="Helvetica", fontSize=9.5, leading=13, textColor=BODY_COLOR)),
        ])
    ds_tbl = Table(ds_data, colWidths=[1.3 * inch, 1.5 * inch, 3.7 * inch])
    ds_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, ROW_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE_GRAY),
    ]))
    story.append(ds_tbl)

    story.append(Spacer(1, 10))
    story.append(Paragraph("5.2  Why No Traditional Database?", style_h2))
    story.append(Paragraph(
        "No traditional database is used — this is intentional for demo simplicity. For a portfolio project, "
        "introducing a managed database (SQL or NoSQL) and a backend API would add significant infrastructure "
        "complexity (provisioning, migrations, connection management, hosting costs) without meaningfully "
        "improving the demonstration of front-end and integration skills. By using TypeScript constants for "
        "products and localStorage for user-specific state, the project remains fully functional, instantly "
        "deployable, and zero-cost to host — while still showcasing real e-commerce flows.", style_body))

    story.append(Paragraph("5.3  Known Limitations", style_h2))
    limitations = [
        "Data is device-specific: cart, wishlist, and orders stored in localStorage are not synced across "
        "devices or browsers. A user on their phone will not see orders placed on their laptop.",
        "No central inventory: because products are static, there is no real stock management or availability "
        "tracking tied to a backend.",
        "No order persistence beyond the browser: clearing browser data or switching devices erases order history.",
    ]
    story.append(make_bullet_list(limitations))

    story.append(Paragraph("5.4  Production Path", style_h2))
    story.append(Paragraph(
        "For a production application, the data layer would be replaced with a proper database such as "
        "PostgreSQL (e.g., via Supabase or PlanetScale) or MongoDB, accessed through a backend API. This would "
        "enable cross-device sync, real inventory management, persistent order records, and server-side "
        "business logic. The current architecture is designed so that swapping in a real backend would primarily "
        "involve replacing the Zustand persist calls with API calls — the component layer would remain largely "
        "unchanged.", style_body))
    story.append(PageBreak())

    # ===================================================================
    # 8. DEPLOYMENT & DEVOPS (Section 6)
    # ===================================================================
    story.append(Paragraph("6.  Deployment & DevOps", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "The project uses a modern, automated deployment pipeline that ensures code quality and delivers "
        "updates to production with zero manual intervention. The workflow is built around GitHub as the source "
        "of truth, GitHub Actions for continuous integration, and Vercel for continuous deployment.", style_body))

    story.append(Paragraph("6.1  The Deployment Pipeline", style_h2))

    pipeline_steps = [
        ("GitHub Repository", "The GitHub repository serves as the single source of truth for all code. "
                              "All changes are committed and pushed to the main branch."),
        ("GitHub Actions CI", "On every push, a GitHub Actions workflow automatically runs ESLint to catch "
                               "linting issues and executes a full Next.js production build to verify the "
                               "project compiles without errors."),
        ("Vercel Auto-Deploy", "Once a push lands on the main branch, Vercel automatically triggers a new "
                                "deployment, building and deploying the latest code to its global edge network."),
        ("Firebase Console", "The Firebase Console manages authorized domains for OAuth, ensuring the production "
                              "Vercel domain is permitted to perform Google sign-in."),
        ("Zero-Downtime Delivery", "Vercel's edge network provides zero-downtime deployments — the new version "
                                    "goes live instantly with atomic switchover, and traffic is served from edge "
                                    "locations worldwide for low latency."),
    ]
    ps_data = []
    for step, desc in pipeline_steps:
        ps_data.append([
            Paragraph(f'<b>{step}</b>', ParagraphStyle("PS1", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=NAVY)),
            Paragraph(desc, ParagraphStyle("PS2", fontName="Helvetica", fontSize=10, leading=14, textColor=BODY_COLOR)),
        ])
    ps_tbl = Table(ps_data, colWidths=[1.8 * inch, 4.7 * inch])
    ps_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, ROW_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE_GRAY),
    ]))
    story.append(ps_tbl)

    story.append(Spacer(1, 10))
    story.append(Paragraph("6.2  CI/CD Summary", style_h2))
    cicd_items = [
        "<b>Source control:</b> Git + GitHub — branch-based workflow with commits to main triggering the pipeline.",
        "<b>Continuous Integration:</b> GitHub Actions — ESLint + Next.js build on every push; failures block "
        "bad code from reaching production.",
        "<b>Continuous Deployment:</b> Vercel — automatic build and deploy on push to main, no manual steps required.",
        "<b>Authentication config:</b> Firebase Console — authorized domains managed for production OAuth.",
        "<b>Hosting:</b> Vercel edge network — global CDN distribution with automatic HTTPS and zero-downtime releases.",
    ]
    story.append(make_bullet_list(cicd_items))
    story.append(PageBreak())

    # ===================================================================
    # 9. CHALLENGES & SOLUTIONS (Section 7)
    # ===================================================================
    story.append(Paragraph("7.  Challenges & Solutions", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "During development, several technical challenges arose that required investigation and problem-solving. "
        "Each challenge and its resolution is documented below.", style_body))

    challenges = [
        {
            "title": "@base-ui/react render prop vs. Radix UI asChild",
            "challenge": "The @base-ui/react component library requires a 'render' prop for composition, "
                         "whereas the more common Radix UI pattern uses an 'asChild' prop. This fundamental "
                         "API difference affected 9+ component usages across the project that had been written "
                         "following shadcn/ui (Radix-based) conventions.",
            "solution": "Refactored all 9+ component usages to use the 'render' prop pattern instead of 'asChild'. "
                        "Each component was reviewed and updated to pass the render function correctly, ensuring "
                        "proper composition and styling passed through to child elements.",
        },
        {
            "title": "Firebase OAuth domain authorization for Vercel deployment",
            "challenge": "After deploying to Vercel, Google OAuth sign-in failed because the production domain "
                         "was not listed in Firebase's authorized domains. Firebase Authentication rejects OAuth "
                         "requests originating from domains not in the authorized list, causing a redirect error.",
            "solution": "Added the production Vercel domain to the authorized domains list in the Firebase Console "
                        "(Authentication → Settings → Authorized domains). This allowed OAuth redirects to complete "
                        "successfully from the live deployment.",
        },
        {
            "title": "Environment variable formatting issues",
            "challenge": "Firebase configuration environment variables experienced formatting issues during "
                         "deployment, causing the Firebase initialization to fail silently or use incorrect "
                         "values, breaking authentication on the production build.",
            "solution": "For demo reliability, the Firebase configuration was hardcoded directly in the source "
                        "code rather than relying on environment variables. While not ideal for production (where "
                        "secrets should remain in environment variables), this approach ensures the demo works "
                        "consistently for all visitors and reviewers without environment-related failures.",
        },
    ]

    for i, ch in enumerate(challenges, 1):
        story.append(Paragraph(f"7.{i}  {ch['title']}", style_h2))
        story.append(SectionDivider(width=460, thickness=0.8, color=MEDIUM_GRAY))
        story.append(Spacer(1, 6))

        cs_data = [
            [Paragraph("<b>Challenge</b>", ParagraphStyle("CS1", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=ACCENT)),
             Paragraph(ch["challenge"], ParagraphStyle("CS2", fontName="Helvetica", fontSize=10, leading=15, textColor=BODY_COLOR))],
            [Paragraph("<b>Solution</b>", ParagraphStyle("CS3", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=HexColor("#2b8a3e"))),
             Paragraph(ch["solution"], ParagraphStyle("CS4", fontName="Helvetica", fontSize=10, leading=15, textColor=BODY_COLOR))],
        ]
        cs_tbl = Table(cs_data, colWidths=[1.0 * inch, 5.5 * inch])
        cs_tbl.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BACKGROUND", (0, 0), (0, 0), ACCENT_LIGHT),
            ("BACKGROUND", (0, 1), (0, 1), GREEN_LIGHT),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
            ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE_GRAY),
        ]))
        story.append(cs_tbl)
        story.append(Spacer(1, 12))

    story.append(PageBreak())

    # ===================================================================
    # 10. SKILLS DEMONSTRATED (Section 8)
    # ===================================================================
    story.append(Paragraph("8.  Skills Demonstrated", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "This project demonstrates a broad range of modern web development skills spanning frontend "
        "architecture, state management, authentication, UI design, and DevOps. Each skill area below is "
        "showcased through concrete features in the application.", style_body))
    story.append(Spacer(1, 6))

    skills = [
        ("Modern React Development", "React hooks (useState, useEffect, useMemo, useContext) with TypeScript "
         "for type-safe, reusable component logic."),
        ("Next.js App Router", "File-based routing with layouts, nested routes, and server/client component "
         "separation using the latest Next.js 15 App Router paradigm."),
        ("State Management with Zustand", "Lightweight, hook-based global state management with localStorage "
         "persistence middleware for cart, wishlist, and orders."),
        ("Form Validation with Zod & React Hook Form", "Schema-based validation integrated with performant form "
         "state management for a robust, accessible checkout experience."),
        ("OAuth Authentication with Firebase", "Secure Google OAuth 2.0 sign-in flow with session persistence "
         "and protected routes — a real-world authentication pattern."),
        ("Responsive UI Design with Tailwind CSS", "Mobile-first, utility-first responsive design with a dark/light "
         "theme system and premium visual styling."),
        ("CI/CD Pipeline with GitHub Actions", "Automated linting and build verification on every push, ensuring "
         "code quality and preventing broken deployments."),
        ("Deployment Workflow with Vercel", "Zero-config continuous deployment with automatic builds, edge network "
         "distribution, and atomic zero-downtime releases."),
        ("Git Version Control & Collaborative Workflow", "Structured commit history, branch-based development, and "
         "GitHub as a remote source of truth — industry-standard version control practices."),
    ]

    sk_data = []
    for skill, desc in skills:
        sk_data.append([
            Paragraph(f'<b>{skill}</b>', ParagraphStyle("SK1", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=NAVY)),
            Paragraph(desc, ParagraphStyle("SK2", fontName="Helvetica", fontSize=10, leading=14, textColor=BODY_COLOR)),
        ])
    sk_tbl = Table(sk_data, colWidths=[2.1 * inch, 4.4 * inch])
    sk_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, ROW_ALT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, LINE_GRAY),
    ]))
    story.append(sk_tbl)
    story.append(PageBreak())

    # ===================================================================
    # 11. FUTURE IMPROVEMENTS (Section 9)
    # ===================================================================
    story.append(Paragraph("9.  Future Improvements", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "While the current project is a fully functional portfolio demo, there are numerous directions in which "
        "it could be extended if developed further into a production application. The following improvements "
        "represent the most impactful next steps:", style_body))
    story.append(Spacer(1, 6))

    future_items = [
        "<b>Real database</b> — Integrate PostgreSQL via Supabase or PlanetScale to replace localStorage with a "
        "persistent, cross-device data layer for products, orders, and user profiles.",
        "<b>Payment integration</b> — Add Stripe for real payment processing, enabling actual checkout transactions "
        "with credit card, Apple Pay, and Google Pay support.",
        "<b>Admin dashboard with full CRUD</b> — Expand the admin panel to support creating, updating, and deleting "
        "products and orders with a complete management interface.",
        "<b>Manager / Employee role dashboards</b> — Implement role-based dashboards with different permissions and "
        "views for managers versus employees.",
        "<b>Email notifications</b> — Send order confirmation, shipping, and delivery email notifications to "
        "customers using an email service provider.",
        "<b>Product reviews and ratings</b> — Allow authenticated users to leave star ratings and written reviews "
        "on purchased jerseys, building social proof.",
        "<b>Multi-language support</b> — Add internationalization (i18n) to serve users in multiple languages, "
        "appropriate for a global football audience.",
        "<b>Real inventory management</b> — Track stock levels per product and size, with automatic 'Out of Stock' "
        "badges and backorder handling tied to the database.",
    ]
    story.append(make_bullet_list(future_items))

    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "These improvements would transform the project from a portfolio demo into a production-ready e-commerce "
        "platform. The current architecture — particularly the clean separation between state management and "
        "component rendering — is designed to accommodate these upgrades incrementally without requiring a full "
        "rewrite.", style_body))
    story.append(PageBreak())

    # ===================================================================
    # 12. CONCLUSION (Section 10)
    # ===================================================================
    story.append(Paragraph("10.  Conclusion", style_h1))
    story.append(SectionDivider(width=460, thickness=1.5, color=ACCENT))
    story.append(Spacer(1, 10))

    story.append(Paragraph(
        "Global Jersey Store is a comprehensive e-commerce web application that demonstrates a wide spectrum of "
        "modern web development skills in a single, cohesive project. From the initial product catalog and "
        "responsive UI design through to authentication, form-validated checkout, order management, and "
        "automated CI/CD deployment, the project covers the full lifecycle of a real-world web application.",
        style_body))

    story.append(Paragraph("10.1  What Was Built", style_h2))
    built_items = [
        "A full-featured e-commerce storefront with 50+ international football jerseys, filtering, search, and "
        "sorting capabilities.",
        "A complete shopping flow: product browsing → cart management → validated checkout → order confirmation "
        "with unique order numbers and delivery estimates.",
        "Google OAuth authentication via Firebase with protected account and order history pages.",
        "A persistent wishlist and cart system using Zustand with localStorage persistence.",
        "A polished, responsive UI with dark/light themes, premium styling, and smooth interactions.",
        "An automated deployment pipeline with GitHub Actions CI and Vercel CD.",
    ]
    story.append(make_bullet_list(built_items))

    story.append(Paragraph("10.2  What Was Learned", style_h2))
    learned_items = [
        "How to architect a Next.js application using the App Router with file-based routing and layout composition.",
        "Practical state management with Zustand, including persisting state to localStorage and structuring stores "
        "for cart, wishlist, and orders.",
        "Integrating third-party authentication (Firebase OAuth) and handling domain authorization for production.",
        "Building accessible, validated forms with Zod schemas and React Hook Form.",
        "Adapting to library API differences (@base-ui/react's render prop vs. Radix's asChild) through systematic "
        "refactoring.",
        "Setting up a complete CI/CD pipeline from GitHub Actions through Vercel deployment.",
        "The trade-offs of a database-free architecture for demos versus production applications.",
    ]
    story.append(make_bullet_list(learned_items))

    story.append(Paragraph("10.3  Closing Statement", style_h2))
    story.append(Paragraph(
        "As a portfolio piece, Global Jersey Store demonstrates not only technical proficiency across the modern "
        "web development stack but also the ability to make pragmatic architectural decisions, solve real "
        "integration challenges, and deliver a polished, deployable product. The project showcases end-to-end "
        "ownership — from design and development to testing, CI/CD, and deployment — making it a strong "
        "representation of full-stack web development capability. It stands as both a testament to the skills "
        "acquired and a foundation for continued growth as a developer.", style_body))

    story.append(Spacer(1, 30))
    closing_tbl = Table([[
        Paragraph(
            '<font color="white"><b>Global Jersey Store</b></font><br/>'
            '<font color="#e63946" size="9">A portfolio project by Nossaiba El Asri — July 2026</font>',
            ParagraphStyle("Closing", fontName="Helvetica", fontSize=12, leading=18, alignment=TA_CENTER, textColor=white))
    ]], colWidths=[6.5 * inch])
    closing_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 20),
        ("RIGHTPADDING", (0, 0), (-1, -1), 20),
        ("TOPPADDING", (0, 0), (-1, -1), 18),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
        ("BOX", (0, 0), (-1, -1), 1.5, ACCENT),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(closing_tbl)

    return story


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    from reportlab.lib.pagesizes import LETTER
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=LETTER,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=1.0 * inch,
        bottomMargin=0.9 * inch,
        title="Global Jersey Store — Technical Project Report",
        author="Nossaiba El Asri",
        subject="E-Commerce Web Application Technical Report",
    )

    story = build_story()
    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"PDF generated successfully at: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
