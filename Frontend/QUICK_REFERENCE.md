# Quick Reference Guide

## 🎨 Copy-Paste Components

### KPI Card
```html
<div class="kpi-card">
  <div class="kpi-header">
    <p class="kpi-label">Total Investment</p>
    <div class="kpi-icon icon-blue">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="12 1 12 23"></polyline>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    </div>
  </div>
  <h2 class="kpi-value">₹ 125,000</h2>
  <p class="kpi-footer">Capital invested</p>
</div>
```

**CSS:**
```css
.kpi-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

---

### Data Table
```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
        <td>₹ 1,000</td>
        <td><span class="badge badge-success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

**CSS (in app.css):**
```css
.data-table thead {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--border-color);
}

.data-table tbody tr:hover {
  background: var(--bg-tertiary);
}
```

---

### Status Badge
```html
<!-- Success -->
<span class="badge badge-success">✓ +2.3%</span>

<!-- Danger -->
<span class="badge badge-danger">✗ -0.8%</span>

<!-- Info -->
<span class="badge badge-info">Active</span>
```

**CSS:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #e7f5f0;
  color: #16a34a;
}

.badge-danger {
  background: #fee2e2;
  color: #dc2626;
}
```

---

### Empty State
```html
<div class="empty-state">
  <div class="empty-icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
  </div>
  <h3>No Data Available</h3>
  <p>Add your first item to get started</p>
</div>
```

**CSS:**
```css
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  padding: 12px;
  background: #f3f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
```

---

### Primary Button
```html
<button class="btn btn-primary">Action</button>
```

**CSS:**
```css
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #5b7cfa 0%, #748ffc 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(91, 124, 250, 0.3);
}
```

---

### Page Header
```html
<div class="page-header">
  <h1 class="page-title">Your Holdings</h1>
  <p class="page-subtitle">Manage and monitor investments</p>
</div>
```

**CSS:**
```css
.page-header {
  padding-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
}
```

---

## 🎯 Icon SVG Templates

### Trend Up
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
  <polyline points="17 6 23 6 23 12"></polyline>
</svg>
```

### Trend Down
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23 18 13.5 8.5 8.5 13.5 1 7"></polyline>
  <polyline points="17 18 23 18 23 12"></polyline>
</svg>
```

### Bar Chart
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <line x1="18" y1="20" x2="18" y2="10"></line>
  <line x1="12" y1="20" x2="12" y2="4"></line>
  <line x1="6" y1="20" x2="6" y2="14"></line>
</svg>
```

### Wallet
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
  <path d="M16 3h-2.17a2 2 0 0 0-3.66 0H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"></path>
</svg>
```

### File/Document
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
  <polyline points="13 2 13 9 20 9"></polyline>
</svg>
```

---

## 🎨 Color Reference

```
Primary: #5b7cfa
Primary Light: #748ffc
Success: #16a34a
Success Light: #e7f5f0
Danger: #dc2626
Danger Light: #fee2e2
Text Primary: #1a1a1a
Text Secondary: #666666
Border: #e5e7eb
Background: #f8f9fb
```

---

## 📐 Spacing & Sizing

```
Small: 8px (gaps, padding)
Medium: 12px (component padding)
Large: 16px (card padding)
XL: 24px (section padding)
2XL: 32px (large gaps)

Icon Sizes: 20px, 24px, 48px
Button Height: 40px (touch target)
Input Height: 40px
Border Radius: 6px (buttons), 8px (inputs), 12px (cards)
```

---

## 🔤 Typography

```
Page Title: 28px, 700 weight
Card Title: 18px, 600 weight
Body: 14px, 400-600 weight
Label: 12px, 600 weight, uppercase
```

---

## ✨ Hover Effects

```css
/* Card Hover */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
transform: translateY(-4px);

/* Button Hover */
transform: translateY(-2px);
box-shadow: 0 8px 16px rgba(91, 124, 250, 0.3);

/* Row Hover */
background: #f3f5f9;
```

---

## 📱 Responsive Grid

```css
/* Desktop (1200px+) */
grid-template-columns: repeat(4, 1fr);

/* Tablet (768px - 1199px) */
@media (max-width: 1200px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile (< 768px) */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

---

## 🎯 Common Patterns

### Data Display (KPI)
```
Icon + Label
Value
Supporting text
```

### Action (Button)
```
Icon + Text
Or just text for secondary
```

### Status (Badge)
```
Icon/Symbol + Text
Background color indicates status
```

### List (Table)
```
Header row (gray background)
Data rows (hover effect)
Status badges inline
```

### Empty (Placeholder)
```
Icon
Title
Description
Optional action button
```

---

## 🚀 Productivity Tips

### VS Code Snippets
Add to snippets.json:

```json
"KPI Card": {
  "prefix": "kpi",
  "body": [
    "<div class=\"kpi-card\">",
    "  <div class=\"kpi-header\">",
    "    <p class=\"kpi-label\">${1:Label}</p>",
    "    <div class=\"kpi-icon icon-blue\">${2:SVG}</div>",
    "  </div>",
    "  <h2 class=\"kpi-value\">${3:Value}</h2>",
    "  <p class=\"kpi-footer\">${4:Footer}</p>",
    "</div>"
  ]
}
```

---

## 📋 Checklist for New Pages

- [ ] Page title and subtitle
- [ ] Proper semantic HTML
- [ ] Scoped `<style>` tag
- [ ] Mobile responsive (`@media` queries)
- [ ] Empty states
- [ ] Hover effects
- [ ] Color contrast check
- [ ] Tested on mobile, tablet, desktop

---

## 🔗 External Resources

- **Icons**: Find more at [Feather Icons](https://feathericons.com/)
- **Colors**: Test contrast at [WebAIM Contrast](https://webaim.org/resources/contrastchecker/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Responsive**: [Responsive Grid](https://css-tricks.com/auto-sizing-columns-css-grid/)

---

**Version**: 1.0  
**Last Updated**: February 2026
