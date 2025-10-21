# Visualization of Time and Seasons
---
**Description**
This project is an interactive web page implemented as a single HTML file with built-in CSS styles and JavaScript scripts. The page dynamically displays the current time of day, date, season, and day of the year, synchronizing with the user's system time. The visual scene adapts to changes: the sky, earth, sun/moon, stars, clouds, house, trees, and particles (leaves, snow, flowers, rain) change colors, positions, and effects depending on the season (winter, spring, summer, autumn) and time of day (night, morning, day, evening).

**Technologies**
**HTML5**: Page structure and element containers.
**CSS3**: Styling, animations (keyframes), gradients, shadows, clip-path for shapes, backdrop-filter for blurring.
**JavaScript (ES6+)**: Time update logic, season/time of day determination, particle and star generation, event handling (window resize).

The project does not require the installation of dependencies or a server — it opens directly in the browser.

**Functionality**
Season Definition
Seasons are defined by month (0–11):
Winter: December (11), January (0), February (1) — snow, cold tones.
Spring: March (2), April (3), May (4) — flowers, pastel gradients.
Summer: June (5), July (6), August (7) — bright colors, rain (optional).
Fall: September (8), October (9), November (10) — warm tones, leaves.

Time of day by clock:
Night: 00:00–05:59.
Morning: 06:00–11:59.
Day: 12:00–17:59.
Evening: 18:00–23:59.

**Visual Elements**
Sky and Earth: Gradient backgrounds that change with the season/time.
Sun/Moon: Positioning and glow with pulse animation.
Stars and Clouds: Generated dynamically (100 stars, 5 clouds).
House: Wood texture, smoke from the chimney, windows lit up at night.
Trees: Layered pine crown with seasonal colors (CSS filters).
Particles: Animated emojis/shapes falling from the screen (number depends on the season).

**Interface**
Left panel: Clock, date, info cards (season, time of day, day of the year), description.
Right panel: Visual scene (hidden on mobile devices).
