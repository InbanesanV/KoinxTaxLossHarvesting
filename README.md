# KoinX — Tax Loss Harvesting

A production-grade Tax Loss Harvesting dashboard for KoinX, built with React 18 + TypeScript + Tailwind CSS + Vite.

![App Screenshot](./screenshots/dashboard.png)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at **http://localhost:5173** by default.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Build tool | Vite |
| State management | React Context API + useReducer |
| Fonts | DM Sans (body), Space Mono (numbers) |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── capitalGains.ts       # Mock capital gains API (800ms delay)
│   └── holdings.ts           # Mock holdings API (800ms delay)
├── components/
│   ├── CapitalGainsCard.tsx  # Pre/After Harvesting cards
│   ├── HoldingsTable.tsx     # Holdings table with select-all
│   ├── HoldingsRow.tsx       # Individual row with checkbox
│   ├── SavingsBanner.tsx     # Animated savings notification
│   └── Loader.tsx            # Skeleton loaders & spinner
├── context/
│   └── HarvestingContext.tsx # Global state (Context + useReducer)
├── hooks/
│   ├── useCapitalGains.ts    # Capital gains data hook
│   └── useHoldings.ts        # Holdings data hook
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   ├── formatCurrency.ts     # ₹ Indian number formatting
│   └── calculations.ts       # All gain/loss logic
├── App.tsx
├── main.tsx
└── index.css
```

---

## ✨ Features

- **Real-time Tax Loss Harvesting**: Select any holding to instantly see how it impacts your after-harvesting capital gains
- **Pre vs After comparison**: Side-by-side cards showing your current and projected tax position
- **Smart savings banner**: Appears only when harvesting actually reduces your tax liability
- **Sorted holdings**: Assets with highest absolute gain shown first for maximum impact
- **View All toggle**: Shows top 5 rows by default, expandable to all holdings
- **Skeleton loading states**: Smooth loading experience for both APIs
- **Error handling**: Retry buttons on all error states
- **Responsive design**: Stacks cards on mobile, side-by-side on desktop
- **Indian currency formatting**: ₹1,23,456.78 format throughout

---

## 🧮 Calculation Logic

### Pre Harvesting (from API)
```
netSTCG = stcg.profits - stcg.losses
netLTCG = ltcg.profits - ltcg.losses
realisedGains = netSTCG + netLTCG
```

### After Harvesting (selected holdings applied)
For each selected holding:
- If `stcg.gain > 0` → added to STCG profits
- If `stcg.gain < 0` → absolute value added to STCG losses
- If `ltcg.gain > 0` → added to LTCG profits
- If `ltcg.gain < 0` → absolute value added to LTCG losses

Then recalculate nets and realised gains.

---

## 💡 Design Decisions & Assumptions

1. **Unique holding IDs**: Some holdings share the same `coin` ticker (e.g., two USDC entries). The app uses `coin::coinName` as a composite key for accurate selection tracking.

2. **Mock APIs**: Both APIs simulate an 800ms network delay using `Promise + setTimeout`. Error simulation is commented out in the code but can be enabled by uncommenting the relevant blocks in `src/api/*.ts`.

3. **Number formatting**: Very small numbers (< 0.01) are shown with up to 8 decimal places. Very tiny values (< 0.000001) use scientific notation.

4. **Savings banner**: Only shown when After Harvesting realised gains are strictly less than Pre Harvesting realised gains AND at least one holding is selected.

5. **Sorting**: Holdings are sorted by `|stcg.gain| + |ltcg.gain|` descending, so the highest-impact assets are shown first.

6. **Tax rate assumption**: The savings banner shows the raw reduction in realised gains (not a tax-adjusted figure), as tax rates vary by user bracket.

---

## 📸 Screenshots

> Add screenshots to the `./screenshots/` directory after running the app.

| View | Description |
|------|-------------|
| `dashboard.png` | Full dashboard with pre/after cards |
| `harvesting-active.png` | Dashboard with selected holdings and savings banner |
| `mobile.png` | Mobile-responsive stacked layout |

---

## 🌐 Live Demo

> [Add deployment URL here, e.g., https://koinx-tax-harvesting.vercel.app]

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
npx vercel --prod

# Deploy to Netlify
npx netlify deploy --prod --dir=dist
```
