# Design Direction & Visual Identity — AI Interview Coach

I want you to establish a clean, modern and minimalist visual identity for this product.

The design references below are provided to communicate the direction, not to be copied. Use your creativity and design judgement to bring them together into a cohesive product experience.

## 1. Design references

**Overall product and visual direction**

- [https://brnq.app/](https://brnq.app/)
- [https://www.cloudflare.com/](https://www.cloudflare.com/)

**Brand colour and surface style (adopted 18 Nov 2026)**

- PitchBot landing page concept: light neutral surfaces, a pastel aurora wash, frosted glass cards, charcoal pill buttons and a glossy orb. Cue uses its colour and material language, not its layout or content.

**Authenticated dashboard**

- [https://dash.cloudflare.com/9f9c5fc35bc8ae9330a7edfc939d2f4d/home](https://dash.cloudflare.com/9f9c5fc35bc8ae9330a7edfc939d2f4d/home)

**Login page**

- [https://pamoja.oluwatosin.io/auth/login](https://pamoja.oluwatosin.io/auth/login)

Use these references to understand layout, typography, spacing, navigation, visual hierarchy and interaction patterns.

Do not copy their branding, logos, proprietary assets or exact layouts.

## 2. Brand personality

The product should feel:

- Minimal
- Intelligent
- Professional
- Calm
- Modern
- Approachable
- Confident

Avoid making it look like a generic AI wrapper or an overly decorative startup landing page.

The interface should communicate quality through simplicity, typography, spacing and thoughtful interactions.

## 3. Theme and colour direction

**The entire application uses a light theme.**

The direction is "soft sunrise": calm neutral surfaces, with colour coming from a pastel aurora wash behind key moments rather than from the UI chrome. Actions are charcoal. Blue is the voice colour and marks anything live or interactive.

This replaces the earlier forest green proposal.

### Palette

**Neutrals**

| Token | HEX | Use |
| --- | --- | --- |
| `canvas` | `#F7F7F8` | Page background |
| `sunken` | `#F2F3F5` | Sidebar, recessed areas, chips |
| `surface` | `#FFFFFF` | Cards, inputs, menus |
| `panel` | `#F1F2F4` | Hover and selected fills |
| `subtle` | `#ECEEF1` | Progress tracks |
| `line` | `#ECEDF0` | Default borders |
| `line-strong` | `#E1E3E8` | Input and control borders |
| `line-hover` | `#CDD1D8` | Hovered borders |

**Text**

| Token | HEX | Use |
| --- | --- | --- |
| `ink` | `#121316` | Primary text |
| `ink-soft` | `#5F6470` | Secondary text |
| `ink-faint` | `#9298A3` | Placeholders, metadata |

**Action and voice**

| Token | HEX | Use |
| --- | --- | --- |
| `accent-solid` | `#16171A` | Primary buttons, selected tabs and pills |
| `accent-hover` | `#2C2E34` | Primary hover |
| `accent` | `#2F6BFF` | Voice orb, live indicators, highlighted headline words, links, focus border |
| `accent-strong` | `#1D4ED8` | Small blue labels on white |
| `accent-soft` | `#EEF3FF` | Blue tag backgrounds |
| `accent-line` | `#D5E1FF` | Blue tag borders, text selection |

**Aurora (atmosphere only)**

| Token | HEX |
| --- | --- |
| `aura-sun` | `#FCE9A9` |
| `aura-peach` | `#FDDCC0` |
| `aura-sky` | `#C7E6F5` |
| `aura-mint` | `#CDEFE2` |
| `aura-lilac` | `#E2DDFB` |

**Feedback**

| Token | HEX |
| --- | --- |
| `danger` | `#E5484D` |
| `danger-hover` | `#CE3A3F` |
| `danger-soft` | `#FDEEEE` |

### Rules

- Charcoal is the only button colour for primary actions. Do not make primary buttons blue.
- Blue is reserved for voice, live state and focus. Do not use it as a decorative fill.
- Pastels appear only in the aurora wash and in small icon tiles. Never use them for text, borders or buttons.
- Use the aurora behind a few key moments: the landing hero, the auth showcase, the dashboard live preview, the interviewer tile and the closing call to action. Most surfaces stay plain white.
- Frosted glass (`.glass`) is for things that float over the aurora: floating cards, status pills, tab groups.

### Reasoning

The neutral surfaces keep the product calm and professional. The aurora adds warmth and approachability without competing with content. Charcoal actions read as confident and premium. A single blue tied to the voice orb makes "the interviewer is live" instantly recognisable across the landing page, dashboard and interview room.

## 4. Typography

Use **Onest** as the primary font family throughout the application.

Typography is an important part of this design direction.

Use:

- Strong but restrained hero typography.
- Clear heading hierarchy.
- Comfortable body-text sizing.
- Consistent font weights.
- Good line-height and spacing.

Avoid unnecessarily large headings across every page.

Labels and small headings:

- Use sentence case everywhere ("Prepare", "Session preview", "15 min · Focus on story").
- Do not use all-caps labels, wide letter-spacing or monospace "eyebrow" text. That pattern reads as templated and machine-made.
- Build hierarchy with size, weight and colour instead. Section labels are 13px regular in `ink-faint`. Card labels are 13px medium in `ink`, with secondary detail in `ink-faint`. Group titles are real 16px semibold headings.
- Write numbers plainly ("Step 1", "1"), not zero-padded ("01"). Use `tabular-nums` for scores so the digits line up.

## 5. Landing page — keep it intentionally simple

The public landing page is the entry point to the product.

I do not want a lengthy marketing website with multiple sections, feature grids, testimonials, pricing tables or unnecessary content.

The landing page should focus on one thing:

**Communicating what the application does and encouraging visitors to get started.**

The landing page should contain only:

### Hero section

The hero should clearly communicate that this is an AI-powered interview practice platform.

Suggested messaging direction:

Headline:
"Practise interviews. Get better at showing what you know."

Supporting text:
"Have realistic voice conversations with AI, improve how you communicate your experience, and get feedback that helps you perform better in interviews."

Primary CTA:
"Get Started"

The CTA should navigate to the login page.

You can refine the wording if you have a stronger alternative, but retain the central product promise: practising interviews with AI.

### Voice orb / pulse visual

The hero must include a distinctive voice pulse or orb visual.

This should be one of the main visual elements of the landing page.

Explore an elegant, abstract voice visualisation that communicates:

- Conversation.
- Listening.
- Speaking.
- AI interaction.

It could be a soft animated orb, layered circular waveforms or a subtle sound-wave composition.

Keep it minimal and visually interesting.

Avoid generic AI robot illustrations, stock photography and overly complicated 3D graphics.

The visual should feel connected to the actual interview room experience.

### Landing page boundaries

Do not add:

- Pricing sections.
- Testimonial carousels.
- Long feature sections.
- Blog sections.
- Unnecessary marketing content.
- Large collections of decorative cards.
  \- No navigation

The landing page should feel intentional, not incomplete.

## 6. Login and authentication

Use [https://pamoja.oluwatosin.io/auth/login](https://pamoja.oluwatosin.io/auth/login) as inspiration for the authentication experience.

Create a clean, minimal login page consistent with the overall brand.

Required pages:

- Login
- Sign up
- Forgot password

Prioritise:

- Clear form hierarchy.
- Comfortable spacing.
- Accessible form controls.
- Clear validation and error states.
- Subtle interactions.
- Responsive behaviour.

Do not make authentication visually complicated.

## 7. Authenticated dashboard

Use the Cloudflare dashboard as inspiration for the authenticated application layout.

I particularly like the structured, functional approach to dashboard navigation.

Explore:

- A clean sidebar.
- A minimal top navigation/header.
- Clear page titles.
- Well-organised content areas.
- Subtle borders and neutral surfaces.
- Consistent spacing.
- Useful information hierarchy.

The dashboard should feel like a professional workspace rather than a marketing website.

Possible navigation:

- Overview
- Practise interviews
- Learning centre
- Interview history
- Progress
- Settings

Use your design judgement to organise these appropriately around the actual product requirements.

Avoid filling the dashboard with meaningless statistics or decorative widgets.

## 8. Interview experience

The interview room is one of the most important experiences in the product.

It should have a calm, focused interface.

The voice orb should be the visual centrepiece.

Create clear visual states for:

- Idle.
- AI speaking.
- Candidate speaking.
- Processing.
- Connecting.
- Error.

The orb should have subtle, purposeful motion rather than excessive animation.

The surrounding interface should remain light and distraction-free.

## 9. Iconography

**Use Vuesax icons throughout the application.**

Reference:
[https://vuesax.com/](https://vuesax.com/)

Use Vuesax as the consistent icon system for:

- Navigation.
- Actions.
- Interface controls.
- Status indicators.
- Empty states where appropriate.

Do not mix unrelated icon libraries.

Do not use emojis as interface icons.

Ensure icon sizing, stroke weight and alignment remain consistent.

## 10. Design system and reusable components

Before building individual pages, establish a small, reusable design system.

Define:

- Colour tokens.
- Typography scale.
- Spacing scale.
- Border colours.
- Border radius.
- Shadows.
- Button variants.
- Input variants.
- Card styles.
- Navigation styles.
- Icon sizing.
- Focus and interaction states.
- Responsive breakpoints.

Create reusable components for common interface patterns.

Keep the design system lightweight. Do not create abstractions that add complexity without providing value.

### Implemented system

Tokens live in `tailwind.config.ts`. Shared classes live in `app/assets/css/main.css`.

- **Radius:** controls and buttons are full pills. Inputs use `0.7rem`. Cards use `1.25rem`. Large feature panels use `2rem`.
- **Shadows:** `xs` for resting controls, `soft` for card hover, `card` and `float` for glass panels, `menu` for dropdowns, `button` for charcoal buttons (soft top highlight).
- **Buttons:** `primary` (charcoal), `secondary` (white with border), `ghost`, `danger`. All pills, with a slight press-in on click.
- **Inputs and dropdowns:** white, with a 0.5px `line-hover` border and no shadow. Both use the `.field` class.
- **Focus state:** only the 0.5px border changes, to `accent` blue. No shadow, halo, ring or outline. Invalid fields keep a 0.5px `danger` border.
- **Shared classes:** `.card`, `.glass` (frosted panel), `.aurora` (pastel wash, inside a `relative overflow-hidden` parent), `.badge` (section label pill), `.chip`, `.field`.
- **File upload (`FileUpload`):** a dashed drop zone with a pastel icon tile, "Drag your file here, or browse" and a line of help text. While a file is dragged over, the border turns blue and a soft aurora fades in. Once a file is added it becomes a file row: a type tile (peach for PDF, sky for Word), the name, size and date, a Replace button and a Remove icon. Dropping a new file on the row replaces it. Errors appear underneath in `danger`. Works with keyboard and screen readers.
- **Settings layout:** each section has its title and explanation in a left column (16rem) and its card on the right, with dividers between sections. It stacks on smaller screens.
- **Voice orb:** a glossy glass sphere with a particle globe. Blue when idle or speaking, charcoal while the candidate speaks, light blue when processing, grey when connecting, red on error.

## 11. Interaction and motion

Use subtle animations where they improve the experience.

Examples:

- Gentle orb animation.
- Smooth navigation transitions.
- Button hover and active states.
- Subtle input focus transitions (the 0.5px border changes colour, with no shadow).
- Loading and processing states.

Animations should be purposeful and performant.

Respect reduced-motion preferences.

## 12. Responsive design

The application must work properly on desktop, tablet and mobile.

Pay particular attention to:

- Landing page hero composition.
- Authentication forms.
- Dashboard navigation.
- Interview controls.
- Transcript readability.

Do not simply shrink desktop layouts to fit mobile.

## 13. Implementation instructions

Before implementing the design:

1. Review all the provided design references.
2. Propose a cohesive brand colour palette.
3. Establish the Onest typography system.
4. Define the design tokens.
5. Propose the landing page composition.
6. Define the reusable component system.
7. Explain how the design will translate across the landing page, authentication, dashboard and interview room.

Once the direction is established, implement the design consistently.

Use Nuxt 3, Vue 3 Composition API, TypeScript and Tailwind CSS as specified in the project requirements.

Do not introduce unnecessary dependencies.

Do not build pages or features outside the PRD.

Most importantly, use the references as inspiration and exercise genuine design creativity. I want the result to feel like a distinct, polished product brand rather than a clone of any of these websites.
