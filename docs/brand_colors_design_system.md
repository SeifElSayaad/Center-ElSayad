# Center-ElSayad - Brand Colors & Design System

## 🎨 Extracted Brand Colors from Logo

### Primary Colors

#### Brand Red

- **Hex**: `#DC1F2E`
- **RGB**: rgb(220, 31, 46)
- **Usage**: Primary brand color, main CTAs, important highlights
- **Where to use**:
  - Primary buttons (Add to Cart, Buy Now)
  - Active navigation items
  - Sale/discount badges
  - Important notifications

#### Brand Black

- **Hex**: `#000000`
- **RGB**: rgb(0, 0, 0)
- **Usage**: Text, icons, logo elements
- **Where to use**:
  - Primary headings
  - Body text (or use softer #1A1A1A for better readability)
  - Icons and symbols
  - Navigation text

---

## 🎨 Extended App Color Palette

Based on your logo, here's a complete color system for your app:

### Primary Colors

| Color Name            | Hex Code  | Preview | Usage                             |
| --------------------- | --------- | ------- | --------------------------------- |
| **Primary Red**       | `#DC1F2E` | 🔴      | Main brand color, primary buttons |
| **Primary Red Dark**  | `#B01824` | 🔴      | Button hover/pressed states       |
| **Primary Red Light** | `#FFE5E8` | 🌸      | Background tints, badges          |

### Neutral Colors (Grays)

| Color Name          | Hex Code  | Preview | Usage                      |
| ------------------- | --------- | ------- | -------------------------- |
| **Black**           | `#000000` | ⚫      | Primary text, headings     |
| **Dark Gray**       | `#1A1A1A` | ⚫      | Body text (easier on eyes) |
| **Medium Gray**     | `#6B6B6B` | ⚫      | Secondary text, captions   |
| **Light Gray**      | `#E5E5E5` | ⚪      | Borders, dividers          |
| **Background Gray** | `#F5F5F5` | ⚪      | Screen backgrounds         |
| **White**           | `#FFFFFF` | ⚪      | Cards, inputs, buttons     |

### Semantic Colors (System Colors)

| Color Name         | Hex Code  | Preview | Usage                     |
| ------------------ | --------- | ------- | ------------------------- |
| **Success Green**  | `#10B981` | 🟢      | Order confirmed, in stock |
| **Warning Orange** | `#F59E0B` | 🟠      | Low stock, pending        |
| **Error Red**      | `#EF4444` | 🔴      | Errors, out of stock      |
| **Info Blue**      | `#3B82F6` | 🔵      | Information, links        |

---

## 🔤 Typography Recommendations

Based on your logo's clean, modern style:

### Recommended Font Pairings

#### Option 1: Modern & Professional

- **Primary Font**: **Inter** (Google Fonts - FREE)
  - Headings: Inter Bold (700)
  - Body text: Inter Regular (400)
  - Captions: Inter Medium (500)
- **Why**: Clean, modern, excellent readability on mobile

#### Option 2: Friendly & Approachable

- **Primary Font**: **Poppins** (Google Fonts - FREE)
  - Headings: Poppins SemiBold (600)
  - Body text: Poppins Regular (400)
  - Excellent for educational products

#### Option 3: Professional & Elegant

- **Primary Font**: **Roboto** (Google Fonts - FREE)
  - Most widely used mobile font
  - Great performance in React Native

**Recommendation**: Start with **Inter** - it's modern, clean, and very popular in 2026

---

## 📐 Spacing & Sizing System

### Spacing Scale (8pt Grid System)

```
4px  = 0.5 unit (xs)
8px  = 1 unit (sm)
16px = 2 units (md)
24px = 3 units (lg)
32px = 4 units (xl)
48px = 6 units (2xl)
64px = 8 units (3xl)
```

### Font Sizes

```
Display (Product titles): 32px
H1 (Screen titles): 24px
H2 (Section titles): 20px
H3 (Card titles): 18px
Body: 16px
Caption: 14px
Small: 12px
```

### Border Radius (Rounded Corners)

```
Small (buttons): 8px
Medium (cards): 12px
Large (modals): 16px
Circular (avatars): 50%
```

---

## 🎯 Component Color Usage Guide

### Buttons

**Primary Button** (Add to Cart, Buy Now)

- Background: `#DC1F2E`
- Text: `#FFFFFF`
- Pressed: `#B01824`

**Secondary Button** (View Details)

- Background: `#FFFFFF`
- Border: `#DC1F2E` (1px)
- Text: `#DC1F2E`

**Disabled Button**

- Background: `#E5E5E5`
- Text: `#6B6B6B`

### Cards & Products

**Product Card**

- Background: `#FFFFFF`
- Border: `#E5E5E5` (1px)
- Shadow: subtle gray shadow
- Title: `#1A1A1A`
- Price: `#DC1F2E` (bold)

### Navigation

**Bottom Tab Navigation**

- Active: `#DC1F2E`
- Inactive: `#6B6B6B`
- Background: `#FFFFFF`

### Status Badges

**In Stock**: Green `#10B981`
**Low Stock**: Orange `#F59E0B`
**Out of Stock**: Red `#EF4444`

---

## 📱 Design Principles for Your App

Based on your brand (educational, professional, trustworthy):

1. **Clean & Simple**: Avoid clutter, use white space
2. **Red as Accent**: Don't overuse red, use strategically for important actions
3. **Professional**: Clean layouts, organized grids
4. **Educational**: Friendly, approachable, easy to navigate
5. **Trust**: Clear pricing, honest product images, reliable information

---

## 🛠️ How to Remove Logo Background Yourself

### Method 1: Online Tool (Easiest)

1. Go to **remove.bg** (https://www.remove.bg)
2. Upload your logo
3. Download the PNG with transparent background
4. **FREE** for standard resolution

### Method 2: Canva (Free)

1. Go to canva.com
2. Upload your logo
3. Click "Edit Image" → "Background Remover"
4. Download as PNG

### Method 3: Figma (You'll Learn This)

1. Import your logo to Figma
2. Use the "Remove Background" plugin
3. Or manually trace over it with vector shapes

---

## 📋 Next Steps

1. ✅ Use the transparent logo I created for you
2. ✅ Copy these color codes to use in Figma
3. ⬜ Set up Figma account
4. ⬜ Create your first wireframe using these colors
5. ⬜ Apply this design system consistently

---

## 🎨 Quick Reference - Copy These to Figma

When you start designing in Figma, create "Color Styles" with these values:

```
Primary/Red: #DC1F2E
Primary/Red Dark: #B01824
Primary/Red Light: #FFE5E8
Neutral/Black: #000000
Neutral/Dark Gray: #1A1A1A
Neutral/Medium Gray: #6B6B6B
Neutral/Light Gray: #E5E5E5
Neutral/Background: #F5F5F5
White: #FFFFFF
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Info: #3B82F6
```

Your brand colors are perfect for an e-commerce app - professional yet approachable! 🎨
