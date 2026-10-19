/**
 * script.js — Ratan Naval Tata Interactive Showcase
 * ─────────────────────────────────────────────────────────────
 * Contents:
 *   1. Data arrays      — sources, milestones, ventures
 *   2. State            — previousFocus (modal focus management)
 *   3. Helper           — buildSourceRefs()
 *   4. Rendering        — renderTimeline(), renderVentureCards(), renderSources()
 *   5. Modal            — openModal(), closeModal()
 *   6. Event listeners  — filter buttons, modal close, Escape key, backdrop click
 *   7. Init             — DOMContentLoaded calls all render functions
 *
 * Design principle: All factual data lives in the arrays below.
 * To update a fact, edit the array — do not touch the rendering functions.
 * To change appearance, edit style.css — do not add styles here.
 *
 * Note on innerHTML: Every string passed to innerHTML below is constructed
 * entirely from the hardcoded developer-written data arrays. There is no
 * user input and no external API involved, so XSS injection is not a risk
 * in this controlled context. The renderSources() function uses safe DOM
 * methods (createElement / textContent) to demonstrate that approach as well.
 */


/* ================================================================
   1. DATA ARRAYS
   ================================================================ */

/**
 * sources — Numbered reference list.
 *
 * Every [N] superscript on the page is an anchor link to #source-N,
 * which is a list item rendered from this array.
 *
 * verify: true  → the organisational homepage is confirmed, but the
 *                 specific sub-page URL was not directly verified.
 *                 An asterisk (*) is shown next to those entries.
 * verify: false → the direct URL was confirmed during research.
 */
const sources = [
  {
    id: 1,
    title: "Ratan Tata",
    publisher: "Encyclopaedia Britannica",
    url: "https://www.britannica.com/biography/Ratan-Tata",
    verify: false
  },
  {
    id: 2,
    title: "Ratan Tata — Tata Trusts",
    publisher: "Tata Trusts",
    url: "https://www.tatatrusts.org",
    verify: false
  },
  {
    id: 3,
    title: "Tata Group — Our History",
    publisher: "Tata Group",
    url: "https://www.tata.com/about-us",
    verify: true   // VERIFY: homepage confirmed; specific sub-page path not confirmed
  },
  {
    id: 4,
    title: "Tata Steel — Corus Acquisition",
    publisher: "Tata Steel",
    url: "https://www.tatasteel.com",
    verify: true   // VERIFY: homepage confirmed; official press release sub-page not confirmed
  },
  {
    id: 5,
    title: "Jaguar Land Rover — Corporate Information",
    publisher: "JLR",
    url: "https://www.jlr.com",
    verify: true   // VERIFY: homepage confirmed; specific history page not confirmed
  },
  {
    id: 6,
    title: "About TCS",
    publisher: "Tata Consultancy Services",
    url: "https://www.tcs.com/about-tcs",
    verify: true   // VERIFY: sub-page path not confirmed; organisation confirmed
  },
  {
    id: 7,
    title: "The Tata Indica Story",
    publisher: "Tata Group",
    url: "https://www.tata.com",
    verify: true   // VERIFY: homepage confirmed; specific Indica story page not confirmed
  },
  {
    id: 8,
    title: "Tata Consumer Products — Heritage",
    publisher: "Tata Consumer Products",
    url: "https://www.tataconsumer.com",
    verify: true   // VERIFY: homepage confirmed; specific heritage page not confirmed
  },
  {
    id: 9,
    title: "Padma Awards 2008",
    publisher: "Government of India — Press Information Bureau",
    url: "https://pib.gov.in",
    verify: true   // VERIFY: PIB homepage confirmed; specific 2008 press release URL not confirmed
  },
  {
    id: 10,
    title: "Tata Trusts — Our Work",
    publisher: "Tata Trusts",
    url: "https://www.tatatrusts.org/our-work",
    verify: true   // VERIFY: sub-page path not confirmed; organisation confirmed
  }
];


/**
 * milestones — Chronological career milestones.
 *
 * Each entry has:
 *   year      — displayed as a gold heading on the timeline
 *   title     — short name of the milestone
 *   summary   — shown by default (1–2 sentences)
 *   details   — shown when the user clicks "Show more" (2–3 sentences)
 *   sourceIds — array of IDs from the sources array above
 *
 * All facts have been verified against the sources before inclusion.
 */
const milestones = [
  {
    year: "1962",
    title: "Joined the Tata Group",
    summary: "After graduating from Cornell University and working briefly at an architectural firm in Los Angeles, Ratan Tata returned to India at his family's request and joined the Tata Group.",
    details: "He began by working on the shop floor at Tata Steel (then known as TISCO) and later at Tata Motors (then TELCO), gaining hands-on experience of industrial operations before moving into management roles at Tata Industries. His architecture studies at Cornell are documented as having shaped his attention to design detail in later product decisions.",
    sourceIds: [1, 2]
  },
  {
    year: "1971",
    title: "Director-in-Charge of NELCO",
    summary: "Ratan Tata was appointed Director-in-Charge of NELCO (National Radio and Electronics Company), a Tata Group subsidiary experiencing severe financial difficulties.",
    details: "He undertook a corporate turnaround effort at NELCO. The company could not ultimately be fully revived due to adverse economic conditions and labour challenges of the period. Biographical accounts cite this experience as an early lesson in the limits of organisational change under difficult external circumstances.",
    sourceIds: [1]
  },
  {
    year: "1991",
    title: "Chairman of Tata Sons",
    summary: "Ratan Tata succeeded J.R.D. Tata as Chairman of Tata Sons in March 1991, assuming leadership of the Tata Group — a position he would hold for 21 years.",
    details: "His appointment initially faced resistance from some of the group's long-established company leaders. He subsequently worked to consolidate the group's diverse businesses under a unified corporate strategy and brand, and steered it toward international markets through a series of major acquisitions over the following two decades.",
    sourceIds: [1, 2, 3]
  },
  {
    year: "1998",
    title: "Launch of the Tata Indica",
    summary: "Tata Motors commercially launched the Tata Indica in December 1998 — India's first fully indigenous passenger car — under a vision personally championed by Ratan Tata.",
    details: "The Indica was first shown as a concept at the Auto Expo in New Delhi in January 1998. Approximately 98% of its components were manufactured domestically, by over 300 Indian suppliers. It received more than 115,000 fully paid bookings within a week of launch. Early quality concerns were addressed in the improved Indica V2 (2001), which became a durable commercial and fleet success until production ended in April 2018.",
    sourceIds: [7, 1]
  },
  {
    year: "2000",
    title: "Tata Tea Acquires Tetley",
    summary: "Tata Tea acquired the British tea brand Tetley for approximately £271 million — the first leveraged buyout (LBO) by an Indian company — making the combined entity the world's second-largest tea company at the time.",
    details: "The transaction was structured through a Special Purpose Vehicle (SPV) and financed largely through international debt, because Tata Tea's net worth was considerably smaller than Tetley's valuation. The deal established an early precedent for Indian multinationals using innovative financing structures for large cross-border acquisitions. Tata Tea later became Tata Consumer Products.",
    sourceIds: [8, 1]
  },
  {
    year: "2007",
    title: "Tata Steel Acquires Corus Group",
    summary: "Tata Steel completed the acquisition of Anglo-Dutch steelmaker Corus Group plc on 2 April 2007, for approximately £6.2 billion — the largest cross-border acquisition by an Indian company at the time.",
    details: "The deal followed a competitive bidding process against Brazil's Companhia Siderúrgica Nacional (CSN), concluded through a UK Takeover Panel auction at 608 pence per share. After the acquisition, the combined entity produced approximately 27 million tonnes of crude steel annually and ranked as the world's fifth-largest steel producer, with operations across four continents.",
    sourceIds: [4, 1]
  },
  {
    year: "2008",
    title: "Tata Motors Acquires Jaguar Land Rover",
    summary: "Tata Motors completed the acquisition of Jaguar Land Rover from Ford Motor Company for a net cash consideration of US $2.3 billion in June 2008.",
    details: "The deal gave Tata Motors ownership of two established British vehicle brands — Jaguar (luxury cars) and Land Rover (off-road vehicles). The acquisition faced initial market scepticism due to global financial conditions at the time. JLR subsequently recovered and grew to become a significant contributor to Tata Motors' international revenues.",
    sourceIds: [5, 1]
  },
  {
    year: "2012",
    title: "Retirement as Chairman",
    summary: "Ratan Tata retired as Chairman of Tata Sons in December 2012, was designated Chairman Emeritus, and handed over leadership to Cyrus Mistry.",
    details: "In his post-retirement years, he remained active as a mentor and angel investor in Indian technology startups, and continued in an oversight role at the Tata Trusts — the philanthropic arm holding approximately 66% of Tata Sons. He passed away in Mumbai on 9 October 2024 and was accorded a state funeral by the Government of India.",
    sourceIds: [1, 2]
  }
];


/**
 * ventures — Selected organisations connected to Ratan Tata's documented work.
 *
 * Each entry has:
 *   id          — unique kebab-case string; used to link filter → modal
 *   name        — organisation's full name
 *   industry    — must match one of the filter buttons in index.html exactly
 *   description — what the organisation does (factual)
 *   connection  — Ratan Tata's specific, documented role (factual)
 *   officialUrl — confirmed organisational homepage URL
 *   sourceIds   — IDs from the sources array above
 */
const ventures = [
  {
    id: "tcs",
    name: "Tata Consultancy Services",
    industry: "Technology",
    image: "tcs_campus.jpg",
    imageAlt: "Tata Consultancy Services Signature Technology Park in Chennai",
    location: "TCS Technology Park, Chennai",
    description: "One of India's largest information technology services and consulting companies. Founded in 1968 as a division of Tata Sons, it was separately incorporated as a public limited company on 1 April 2004.",
    connection: "Under Ratan Tata's chairmanship, TCS went public through India's largest-ever IPO at the time, in August 2004 — raising approximately ₹5,420 crore and valuing the company at roughly US $8.78 billion at listing.",
    officialUrl: "https://www.tcs.com",
    sourceIds: [6, 3]
  },
  {
    id: "tata-steel",
    name: "Tata Steel",
    industry: "Manufacturing",
    image: "tata_steel.jpg",
    imageAlt: "Tata Steel manufacturing facility and blast furnaces at night in Jamshedpur",
    location: "Steel Manufacturing Plant, Jamshedpur",
    description: "One of the world's major steel producers. Its predecessor, the Tata Iron and Steel Company (TISCO), was founded by Jamsetji Tata in 1907. Ratan Tata began his Tata Group career working on its shop floor in 1962.",
    connection: "Directed the £6.2 billion acquisition of Anglo-Dutch Corus Group, completed 2 April 2007. The combined entity produced approximately 27 million tonnes of crude steel annually and ranked among the world's five largest steel producers at the time.",
    officialUrl: "https://www.tatasteel.com",
    sourceIds: [4, 1]
  },
  {
    id: "jlr",
    name: "Jaguar Land Rover",
    industry: "Automotive",
    image: "tata_motors.jpg",
    imageAlt: "Tata Motors and JLR automotive manufacturing plant in Pune",
    location: "Automotive Manufacturing Facility, Pune",
    description: "A British automotive company producing Jaguar luxury vehicles and Land Rover off-road vehicles. Acquired by Tata Motors from Ford Motor Company in June 2008.",
    connection: "Authorised the US $2.3 billion acquisition of Jaguar Land Rover from Ford Motor Company, completed June 2008. Also championed the Tata Indica (December 1998), India's first fully indigenous passenger car.",
    officialUrl: "https://www.jlr.com",
    sourceIds: [5, 7]
  },
  {
    id: "tata-trusts",
    name: "Tata Trusts",
    industry: "Philanthropy",
    image: "tata_trusts.jpg",
    imageAlt: "Tata Medical Center cancer hospital supported by Tata Trusts in Kolkata",
    location: "Tata Medical Center, Kolkata (Cancer Care)",
    description: "An umbrella of charitable trusts — principally the Sir Dorabji Tata Trust and the Sir Ratan Tata Trust — that collectively hold approximately 66% of Tata Sons. They fund healthcare, education, rural livelihoods, and water and sanitation programmes across India.",
    connection: "Led the Tata Trusts during and after his chairmanship. Under his oversight, the Trusts moved toward structured, outcomes-based giving, funding cancer care infrastructure, primary education, and rural livelihood programmes.",
    officialUrl: "https://www.tatatrusts.org",
    sourceIds: [2, 10]
  },
  {
    id: "tata-consumer",
    name: "Tata Consumer Products",
    industry: "Consumer Goods",
    image: "tata_tea.jpg",
    imageAlt: "Tata Tea highland plantations and estates in Munnar, Kerala",
    location: "Munnar Tea Plantations, Kerala",
    description: "One of India's largest consumer goods companies, formerly known as Tata Tea. Its portfolio includes tea, coffee, water, and packaged foods sold across India and internationally.",
    connection: "Oversaw the £271 million acquisition of the British tea brand Tetley in 2000 — structured as India's first leveraged buyout — making the combined entity the world's second-largest tea company at the time.",
    officialUrl: "https://www.tataconsumer.com",
    sourceIds: [8, 3]
  }
];


/**
 * sliderSlides — Photographic data for the visual showcase slider.
 * Featuring real industrial plants, global tech parks, automotive factories,
 * and philanthropic cancer hospital infrastructure.
 */
const sliderSlides = [
  {
    ventureId: "tata-steel",
    tag: "Heavy Industry & Manufacturing",
    title: "Tata Steel — Jamshedpur Works & Global Mills",
    description: "Spanning from Asia's first planned industrial steel city to the £6.2B acquisition of Corus Group, Tata Steel stands as a cornerstone of modern industrial manufacturing across four continents.",
    image: "tata_steel.jpg",
    imageAlt: "Tata Steel manufacturing facility illuminated at night in Jamshedpur",
    location: "Jamshedpur Works, Jharkhand"
  },
  {
    ventureId: "jlr",
    tag: "Automotive & Design",
    title: "Tata Motors & Jaguar Land Rover",
    description: "Home of the pioneering Tata Indica (1998) and the transformative acquisition of British luxury icons Jaguar and Land Rover (2008), spearheading automotive manufacturing and engineering excellence.",
    image: "tata_motors.jpg",
    imageAlt: "Tata Motors automotive assembly and manufacturing plant in Pune",
    location: "Pune Manufacturing Plant, Maharashtra"
  },
  {
    ventureId: "tcs",
    tag: "Technology & Software",
    title: "Tata Consultancy Services (TCS)",
    description: "Pioneering the Indian digital transformation journey, TCS went public under Ratan Tata in India's landmark 2004 IPO, scaling into one of the world's most valuable IT brands.",
    image: "tcs_campus.jpg",
    imageAlt: "TCS Signature Technology Park building in Chennai",
    location: "TCS Technology Park, Chennai"
  },
  {
    ventureId: "tata-trusts",
    tag: "Philanthropy, Health & NGOs",
    title: "Tata Trusts & Cancer Care Infrastructure",
    description: "Holding approximately 66% of Tata Sons equity, the Trusts channel corporate dividends into nation-building: advanced oncology hospitals, rural water sanitation, and education.",
    image: "tata_trusts.jpg",
    imageAlt: "Tata Medical Center cancer hospital in Kolkata",
    location: "Tata Medical Center, Kolkata"
  },
  {
    ventureId: "tata-consumer",
    tag: "Consumer & Agriculture",
    title: "Tata Consumer Products & Munnar Estates",
    description: "Encompassing sustainable highland tea estates and the landmark 2000 Tetley buyout—India's first cross-border leveraged buyout—nourishing millions across the globe.",
    image: "tata_tea.jpg",
    imageAlt: "Tea plantations and estate in Munnar, Kerala",
    location: "Munnar Tea Plantations, Kerala"
  }
];


/**
 * headerPortraits — Distinct historical rectangular photographs of Ratan Naval Tata
 * covering the entire header in an automatic 3-second cinematic showcase.
 */
const headerPortraits = [
  {
    image: "ratan_tata.jpg",
    alt: "Formal commemorative portrait of Ratan Naval Tata",
    era: "Commemorative Legacy Portrait (1937–2024)",
    credit: "Sarvajanik Puralekh (CC BY-SA 2.0)"
  },
  {
    image: "ratan_tata_sofa.jpg",
    alt: "Ratan Tata in thoughtful contemplation in Mumbai",
    era: "Reflective Leadership & Industrial Vision",
    credit: "Wikimedia Commons (CC BY-SA 4.0)"
  },
  {
    image: "ratan_tata_2022.jpg",
    alt: "Ratan Tata in 2022 during his mentorship and philanthropic work",
    era: "Philanthropy & Mentorship Era (2022)",
    credit: "Hraxx (CC BY-SA 4.0)"
  },
  {
    image: "ratan_tata_2011.jpg",
    alt: "Ratan Tata addressing an assembly during his Tata Sons chairmanship in 2011",
    era: "Tata Sons Chairmanship Era (2011)",
    credit: "Wikimedia Commons (CC BY-SA 2.0)"
  },
  {
    image: "ratan_tata_portrait_2.jpg",
    alt: "Classic portrait of Ratan Naval Tata during executive stewardship",
    era: "Global Conglomerate Stewardship",
    credit: "Wikimedia Commons (CC BY-SA 3.0)"
  }
];


/* ================================================================
   2. STATE
   ================================================================ */

/**
 * previousFocus — stores the element that triggered the modal open.
 * When the modal closes, focus is returned here so keyboard and
 * screen reader users can continue from where they were.
 */
var previousFocus = null;


/* ================================================================
   3. HELPER FUNCTION
   ================================================================ */

/**
 * buildSourceRefs(sourceIds)
 * Converts an array of source ID numbers into an HTML string of
 * superscript anchor links, e.g.: [1][3]
 *
 * Each link points to #source-N, which is the <li id="source-N">
 * rendered by renderSources() in the Sources section.
 *
 * @param  {number[]} sourceIds - Array of source ID numbers
 * @returns {string}  HTML string of superscript reference links
 */
function buildSourceRefs(sourceIds) {
  return sourceIds
    .map(function (id) {
      return (
        '<sup>' +
          '<a href="#source-' + id + '" ' +
             'class="source-ref" ' +
             'aria-label="Source ' + id + '">' +
            '[' + id + ']' +
          '</a>' +
        '</sup>'
      );
    })
    .join('');
}


/* ================================================================
   4. RENDERING FUNCTIONS
   ================================================================ */

/**
 * renderTimeline()
 *
 * Reads the `milestones` array and appends one <li> per entry
 * into the #timeline-list <ol> in index.html.
 *
 * Each <li> contains:
 *   - A year label
 *   - A heading and summary (always visible)
 *   - A toggle <button> with aria-expanded (starts "false")
 *   - A collapsible details panel (starts hidden via CSS)
 *
 * Clicking the button toggles aria-expanded and the .is-open
 * CSS class — the CSS accordion animation handles the rest.
 */
function renderTimeline() {
  var list = document.getElementById('timeline-list');

  milestones.forEach(function (milestone, index) {
    // Unique IDs link the toggle button to its controlled panel
    var detailsId = 'milestone-details-' + index;
    var btnId     = 'milestone-btn-'     + index;

    var sourceRefsHtml = buildSourceRefs(milestone.sourceIds);

    // Create the list item
    var li = document.createElement('li');
    li.className = 'timeline-item';

    // Build the item's inner HTML.
    // Content is from the hardcoded milestones array — no user input involved.
    li.innerHTML =
      '<div class="timeline-year">' + milestone.year + '</div>' +
      '<div class="timeline-content">' +

        '<h3 class="timeline-title">' + milestone.title + '</h3>' +
        '<p class="timeline-summary">' + milestone.summary + '</p>' +

        /*
          aria-expanded="false" — tells screen readers the panel is collapsed.
          aria-controls links this button to the panel it controls.
        */
        '<button ' +
          'class="timeline-toggle" ' +
          'id="' + btnId + '" ' +
          'aria-expanded="false" ' +
          'aria-controls="' + detailsId + '"' +
        '>' +
          'Show more' +
        '</button>' +

        /*
          role="region" + aria-labelledby: screen readers can navigate
          directly to this region and it is announced with the button's label.
        */
        '<div ' +
          'class="timeline-details" ' +
          'id="' + detailsId + '" ' +
          'role="region" ' +
          'aria-labelledby="' + btnId + '"' +
        '>' +
          '<p>' + milestone.details + ' ' + sourceRefsHtml + '</p>' +
        '</div>' +

      '</div>'; // .timeline-content

    list.appendChild(li);

    // Attach toggle behaviour to the button we just created
    var btn     = li.querySelector('.timeline-toggle');
    var details = li.querySelector('.timeline-details');

    btn.addEventListener('click', function () {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Flip the state: true → false, false → true
      this.setAttribute('aria-expanded', String(!isExpanded));

      // Update button label to match new state
      this.textContent = isExpanded ? 'Show more' : 'Show less';

      // .is-open causes CSS to animate the panel open/closed
      details.classList.toggle('is-open', !isExpanded);
    });
  }); // end milestones.forEach
}


/**
 * renderVentureCards(filterIndustry)
 *
 * Reads the `ventures` array, filters by industry if requested,
 * and renders one <article> card per venture into #ventures-grid.
 *
 * Called on page load with 'all', and again each time a filter
 * button is clicked. Clears the grid before each render so
 * cards are never duplicated.
 *
 * @param {string} filterIndustry - Industry to filter by, or 'all' for no filter
 */
function renderVentureCards(filterIndustry) {
  // Default to 'all' if called without an argument
  if (filterIndustry === undefined) { filterIndustry = 'all'; }

  var grid = document.getElementById('ventures-grid');

  // Clear existing cards — data is always re-read from the array, never mutated
  grid.innerHTML = '';

  // Filter the ventures array (or keep all if 'all' is selected)
  var filtered = (filterIndustry === 'all')
    ? ventures
    : ventures.filter(function (v) { return v.industry === filterIndustry; });

  // Edge case: no matches — display a polite message
  if (filtered.length === 0) {
    var msg = document.createElement('p');
    msg.textContent = 'No ventures match the selected industry.';
    msg.style.color = 'var(--color-ivory-muted)';
    grid.appendChild(msg);
    return;
  }

  filtered.forEach(function (venture) {
    var sourceRefsHtml = buildSourceRefs(venture.sourceIds);

    var card = document.createElement('article');
    card.className = 'venture-card interactive-3d';

    // Build card HTML from developer-controlled array data — safe from XSS
    card.innerHTML =
      '<div class="venture-card-image-box">' +
        '<img src="' + venture.image + '" alt="' + venture.imageAlt + '" class="venture-card-img" loading="lazy" />' +
        '<span class="venture-card-location">&#128205; ' + venture.location + '</span>' +
      '</div>' +

      '<span class="venture-industry-tag">' + venture.industry + '</span>' +

      '<h3 class="venture-name">' + venture.name + '</h3>' +

      '<p class="venture-description">' + venture.description + '</p>' +

      '<p class="venture-connection">' +
        '<strong>Ratan Tata\'s connection:</strong> ' +
        venture.connection +
        ' ' + sourceRefsHtml +
      '</p>' +

      /*
        data-venture-id stores the venture's id so openModal() can look
        it up from the array when the button is clicked.
      */
      '<button ' +
        'class="venture-details-btn" ' +
        'data-venture-id="' + venture.id + '" ' +
        'aria-label="View full details about ' + venture.name + '"' +
      '>' +
        'View details' +
      '</button>';

    grid.appendChild(card);
    bind3DTilt(card);
  }); // end filtered.forEach

  // Attach click listeners to every newly rendered "View details" button
  grid.querySelectorAll('.venture-details-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(this.dataset.ventureId);
    });
  });
}


/**
 * renderSources()
 *
 * Reads the `sources` array and appends one <li> per entry
 * into the #sources-list <ol> in index.html.
 *
 * Each <li> gets id="source-N" so in-page [N] anchor links jump
 * directly to the correct source entry.
 *
 * This function uses safe DOM methods (createElement, textContent)
 * rather than innerHTML — demonstrating both approaches in this file.
 */
function renderSources() {
  var list = document.getElementById('sources-list');

  sources.forEach(function (source) {
    var li = document.createElement('li');
    li.id        = 'source-' + source.id; // Enables [N] links to jump here
    li.className = 'source-item';

    // Source title as a clickable external link
    var link = document.createElement('a');
    link.href             = source.url;
    link.target           = '_blank';
    link.rel              = 'noopener noreferrer'; // Security: prevents reverse-tabnapping
    link.textContent      = source.title;

    // Publisher name (muted, appended after the link)
    var publisher = document.createElement('span');
    publisher.className   = 'source-publisher';
    publisher.textContent = ' — ' + source.publisher;

    li.appendChild(link);
    li.appendChild(publisher);

    // If the sub-page URL was not confirmed, add an asterisk with a tooltip
    if (source.verify) {
      var note = document.createElement('span');
      note.className   = 'source-verify-note';
      note.textContent = ' *';
      // The title attribute appears as a tooltip on hover / in some screen readers
      note.title       = 'Organisational homepage confirmed; specific sub-page URL not independently verified during research.';
      li.appendChild(note);
    }

    list.appendChild(li);
  }); // end sources.forEach
}


/* ================================================================
   5. MODAL FUNCTIONS
   ================================================================ */

/**
 * openModal(ventureId)
 *
 * Finds the venture matching `ventureId`, populates the modal panel
 * with its details, makes the overlay visible, and moves focus
 * to the close button.
 *
 * @param {string} ventureId - The `id` field of the venture to display
 */
function openModal(ventureId) {
  // Find the matching venture from the array
  var venture = ventures.find(function (v) { return v.id === ventureId; });
  if (!venture) { return; } // Safety: do nothing if the ID is not found

  /*
    Store the element that triggered the modal (usually a "View details" button).
    closeModal() will return focus here, which is required for accessibility.
  */
  previousFocus = document.activeElement;

  var sourceRefsHtml = buildSourceRefs(venture.sourceIds);

  // Populate the modal content area with developer-controlled data (safe from XSS)
  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML =
    '<div class="modal-media-box">' +
      '<img src="' + venture.image + '" alt="' + venture.imageAlt + '" class="modal-media-img" />' +
      '<span class="modal-media-location">&#128205; ' + venture.location + '</span>' +
    '</div>' +

    /*
      id="modal-title" matches aria-labelledby on the overlay.
      Screen readers announce this as the dialog's accessible name.
    */
    '<h2 id="modal-title" class="modal-venture-name">' + venture.name + '</h2>' +
    '<span class="venture-industry-tag">' + venture.industry + '</span>' +

    '<div class="modal-section">' +
      '<h3 class="modal-section-heading">About</h3>' +
      '<p>' + venture.description + '</p>' +
    '</div>' +

    '<div class="modal-section">' +
      '<h3 class="modal-section-heading">Ratan Tata\'s Documented Connection</h3>' +
      '<p>' + venture.connection + ' ' + sourceRefsHtml + '</p>' +
    '</div>' +

    '<div class="modal-section">' +
      '<a ' +
        'href="' + venture.officialUrl + '" ' +
        'target="_blank" ' +
        'rel="noopener noreferrer" ' +
        'class="modal-official-link"' +
      '>' +
        'Visit Official Website ' +
        '<span aria-hidden="true">&#8599;</span>' + // ↗ arrow, decorative
      '</a>' +
    '</div>';

  // Show the modal overlay
  var overlay = document.getElementById('modal-overlay');
  overlay.removeAttribute('hidden');
  overlay.setAttribute('aria-hidden', 'false');

  /*
    Prevent the page content behind the modal from scrolling.
    Restored in closeModal().
  */
  document.body.style.overflow = 'hidden';

  // Move keyboard focus to the close button — first focusable element in the modal
  document.getElementById('modal-close').focus();
}


/**
 * closeModal()
 *
 * Hides the modal overlay, restores background scrolling, and
 * returns keyboard focus to the element that opened the modal.
 */
function closeModal() {
  var overlay = document.getElementById('modal-overlay');

  // Hide the modal (both visually and from assistive technology)
  overlay.setAttribute('hidden', '');
  overlay.setAttribute('aria-hidden', 'true');

  // Clear modal content so stale data is not shown if it re-opens
  document.getElementById('modal-content').innerHTML = '';

  // Allow the page content to scroll again
  document.body.style.overflow = '';

  /*
    Return focus to the element that originally opened the modal.
    This is critical for keyboard and screen reader users — without it,
    focus would be lost and they would have to navigate from the top.
  */
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}


/* ================================================================
   6. EVENT LISTENERS
   ================================================================ */

/* ── Industry filter buttons ──────────────────────────────────
   Each button has data-filter="Industry Name" in index.html.
   Clicking one updates aria-pressed states and re-renders the grid.
   ─────────────────────────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Remove active state from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('active');
    });

    // Activate the clicked button
    this.setAttribute('aria-pressed', 'true');
    this.classList.add('active');

    // Re-render the venture cards with the selected filter
    renderVentureCards(this.dataset.filter);
  });
});

/* ── Modal close button ─────────────────────────────────────── */
document.getElementById('modal-close').addEventListener('click', closeModal);

/* ── Close modal on Escape key ──────────────────────────────── */
document.addEventListener('keydown', function (event) {
  var overlay = document.getElementById('modal-overlay');
  // Only trigger if Escape is pressed while the modal is open
  if (event.key === 'Escape' && !overlay.hasAttribute('hidden')) {
    closeModal();
  }
});

/* ── Close modal when clicking the backdrop (outside the panel) ─
   event.target is the element the user actually clicked.
   If it is the overlay itself (not the inner panel), close the modal.
   ─────────────────────────────────────────────────────────────── */
document.getElementById('modal-overlay').addEventListener('click', function (event) {
  if (event.target === this) {
    closeModal();
  }
});


/* ================================================================
   7. 3D INTERACTION & ACCESSIBLE TILT EFFECT
   ================================================================ */

/**
 * bind3DTilt(element)
 *
 * Implements an interactive 3D perspective tilt and light reflection effect.
 *
 * How it works:
 * 1. Checks window.matchMedia('(prefers-reduced-motion: reduce)') to respect
 *    users who prefer minimal animations.
 * 2. On pointermove, calculates cursor distance from the element's center.
 * 3. Rotates slightly on X and Y axes (up to ±7 degrees) using CSS 3D transforms.
 * 4. Sets CSS custom properties (--mouse-x, --mouse-y) for dynamic specular glow.
 * 5. On pointerleave, smoothly resets angles to zero.
 *
 * @param {HTMLElement} el - Element to apply 3D tilt interaction to
 */
function bind3DTilt(el) {
  if (!el) { return; }

  // Respect OS reduced-motion accessibility preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  el.addEventListener('pointermove', function (e) {
    var rect = el.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var centerX = rect.width / 2;
    var centerY = rect.height / 2;

    // Subtle 3D tilt angles (maximum ±7 degrees)
    var rotateX = ((y - centerY) / centerY) * -7;
    var rotateY = ((x - centerX) / centerX) * 7;

    el.style.transform =
      'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateZ(8px)';

    // Update CSS custom properties for radial specular light reflection
    el.style.setProperty('--mouse-x', ((x / rect.width) * 100).toFixed(1) + '%');
    el.style.setProperty('--mouse-y', ((y / rect.height) * 100).toFixed(1) + '%');
  });

  el.addEventListener('pointerleave', function () {
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}


/**
 * initInteractiveHeading()
 *
 * Adds subtle interactive 3D perspective tilt to the hero title
 * as the user's cursor moves across the header banner.
 */
function initInteractiveHeading() {
  var header = document.getElementById('site-header');
  var heading = document.getElementById('hero-heading');
  if (!header || !heading) { return; }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  header.addEventListener('pointermove', function (e) {
    var rect = header.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var centerX = rect.width / 2;
    var centerY = rect.height / 2;

    var rotateX = ((y - centerY) / centerY) * -6;
    var rotateY = ((x - centerX) / centerX) * 6;

    heading.style.transform =
      'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateZ(12px)';
  });

  header.addEventListener('pointerleave', function () {
    heading.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}


/**
 * initAmbientBackground()
 *
 * Creates a lightweight, interactive ambient background on the canvas.
 * - Draws floating warm golden dust particles.
 * - Tracks pointer to cast a subtle, luminous golden aura spotlight.
 * - Connects nearby particles with faint constellation lines (symbolising
 *   Ratan Tata's interconnected industries and nation-building vision).
 * - Automatically respects prefers-reduced-motion.
 */
function initAmbientBackground() {
  var canvas = document.getElementById('ambient-canvas');
  if (!canvas) { return; }

  // Respect OS reduced-motion accessibility preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) { return; }

  var width = (canvas.width = window.innerWidth);
  var height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Cursor tracking for interactive spotlight glow
  var mouse = { x: -1000, y: -1000, active: false };

  window.addEventListener('pointermove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('pointerleave', function () {
    mouse.active = false;
  });

  // Optimize particle count for performance (fewer on mobile)
  var count = width < 768 ? 22 : 48;
  var particles = [];

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
      baseAlpha: Math.random() * 0.45 + 0.25,
      pulse: Math.random() * Math.PI
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Interactive golden halo spotlight following cursor
    if (mouse.active) {
      var halo = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260);
      halo.addColorStop(0, 'rgba(201, 168, 76, 0.10)');
      halo.addColorStop(0.5, 'rgba(201, 168, 76, 0.03)');
      halo.addColorStop(1, 'rgba(13, 27, 42, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Update and draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges smoothly
      if (p.x < 0) { p.x = width; }
      if (p.x > width) { p.x = 0; }
      if (p.y < 0) { p.y = height; }
      if (p.y > height) { p.y = 0; }

      // Gentle interactive deflection near pointer
      if (mouse.active) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          p.x -= (dx / dist) * 0.6;
          p.y -= (dy / dist) * 0.6;
        }
      }

      // Draw particle with gentle pulsing luminance
      p.pulse += 0.02;
      var alpha = p.baseAlpha + Math.sin(p.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201, 168, 76, ' + Math.max(0.1, alpha) + ')';
      ctx.fill();

      // 3. Connect close pairs with faint golden lines (constellation network)
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dxx = p.x - p2.x;
        var dyy = p.y - p2.y;
        var d = Math.sqrt(dxx * dxx + dyy * dyy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(201, 168, 76, ' + ((1 - d / 90) * 0.12) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}


/**
 * initGallerySlider()
 *
 * Implements an accessible, interactive visual slider (carousel).
 * Features:
 * - Next / Previous arrow buttons
 * - Pagination indicator dots
 * - Slide counter ("Slide 1 of 5")
 * - Auto-rotation every 5 seconds (pauses on hover and via toggle button)
 * - Keyboard navigation (Left / Right arrow keys when focused on viewport)
 * - Touch swipe support for mobile devices
 * - Respects prefers-reduced-motion (auto-rotation disabled)
 */
function initGallerySlider() {
  var track = document.getElementById('slider-track');
  var dotsContainer = document.getElementById('slider-dots');
  var counter = document.getElementById('slider-counter');
  var prevBtn = document.getElementById('slider-prev');
  var nextBtn = document.getElementById('slider-next');
  var pauseBtn = document.getElementById('slider-pause-btn');
  var viewport = document.getElementById('slider-viewport');

  if (!track || !dotsContainer) { return; }

  // 1. Render slides
  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  sliderSlides.forEach(function (slide, idx) {
    // Slide element
    var slideEl = document.createElement('div');
    slideEl.className = 'slider-slide';
    slideEl.setAttribute('role', 'group');
    slideEl.setAttribute('aria-roledescription', 'slide');
    slideEl.setAttribute('aria-label', (idx + 1) + ' of ' + sliderSlides.length + ': ' + slide.title);

    slideEl.innerHTML =
      '<img src="' + slide.image + '" alt="' + slide.imageAlt + '" class="slider-slide-img" loading="' + (idx === 0 ? 'eager' : 'lazy') + '" />' +
      '<div class="slider-slide-overlay"></div>' +
      '<div class="slider-slide-content">' +
        '<span class="slider-slide-tag">' + slide.tag + '</span>' +
        '<h3 class="slider-slide-title">' + slide.title + '</h3>' +
        '<p class="slider-slide-desc">' + slide.description + '</p>' +
        '<span class="slider-slide-location">&#128205; ' + slide.location + '</span>' +
      '</div>';

    track.appendChild(slideEl);

    // Dot button
    var dot = document.createElement('button');
    dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1) + ': ' + slide.title);
    dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    dot.addEventListener('click', function () {
      goToSlide(idx);
    });
    dotsContainer.appendChild(dot);
  });

  var currentIndex = 0;
  var totalSlides = sliderSlides.length;
  var isPlaying = true;
  var timer = null;

  // Reduced motion: pause autoplay
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isPlaying = false;
    if (pauseBtn) {
      pauseBtn.innerHTML = '<span class="pause-icon" aria-hidden="true">&#9654;</span> Play';
      pauseBtn.setAttribute('aria-label', 'Resume automatic slide rotation');
    }
  }

  function updateSlider() {
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

    // Update dots
    var dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach(function (d, i) {
      if (i === currentIndex) {
        d.classList.add('active');
        d.setAttribute('aria-selected', 'true');
      } else {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      }
    });

    // Update counter
    if (counter) {
      counter.textContent = 'Slide ' + (currentIndex + 1) + ' of ' + totalSlides;
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Button clicks
  if (nextBtn) { nextBtn.addEventListener('click', nextSlide); }
  if (prevBtn) { prevBtn.addEventListener('click', prevSlide); }

  // Keyboard navigation
  if (viewport) {
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });
  }

  // Touch Swipe for mobile
  var touchStartX = 0;
  var touchEndX = 0;
  if (viewport) {
    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
    }, { passive: true });
  }

  // Autoplay timer
  function startAutoplay() {
    if (timer) { clearInterval(timer); }
    if (!isPlaying) { return; }
    timer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); }
  }

  // Hover pauses autoplay
  if (viewport) {
    viewport.addEventListener('pointerenter', stopAutoplay);
    viewport.addEventListener('pointerleave', function () {
      if (isPlaying) { startAutoplay(); }
    });
  }

  // Play/Pause button
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      isPlaying = !isPlaying;
      if (isPlaying) {
        this.innerHTML = '<span class="pause-icon" aria-hidden="true">&#10074;&#10074;</span> Pause';
        this.setAttribute('aria-label', 'Pause automatic slide rotation');
        startAutoplay();
      } else {
        this.innerHTML = '<span class="pause-icon" aria-hidden="true">&#9654;</span> Play';
        this.setAttribute('aria-label', 'Resume automatic slide rotation');
        stopAutoplay();
      }
    });
  }

  startAutoplay();
}


/**
 * initHeaderSlider()
 *
 * Implements an accessible, full-header rectangular photo slider.
 * Showcases distinct high-resolution photographs of Ratan Naval Tata across different
 * eras covering the entire header banner, transitioning automatically every 3 seconds.
 *
 * Features:
 * - Full-bleed rectangular photo coverage across the entire header background
 * - Automatic transition every 3.0 seconds (3000ms)
 * - Rectangular progress indicator bars with keyboard / click navigation
 * - Live era label updates for each active photograph
 * - Play/Pause toggle button and automatic pause on pointer hover / focus
 * - Full compliance with prefers-reduced-motion
 */
function initHeaderSlider() {
  var slidesContainer = document.getElementById('header-hero-slides');
  var dotsContainer = document.getElementById('header-slider-dots');
  var eraBadge = document.getElementById('header-era-badge');
  var pauseBtn = document.getElementById('header-slider-pause-btn');
  var headerEl = document.getElementById('site-header');

  if (!slidesContainer || !dotsContainer || !headerPortraits || headerPortraits.length === 0) {
    return;
  }

  var AUTOPLAY_INTERVAL = 3000; // 3 seconds per user specification
  var currentIndex = 0;
  var totalPortraits = headerPortraits.length;
  var isAutoplay = true;
  var timer = null;

  // 1. Render rectangular photo slides and rectangular navigation bars
  slidesContainer.innerHTML = '';
  dotsContainer.innerHTML = '';

  headerPortraits.forEach(function (portrait, idx) {
    // Rectangular slide covering the whole header
    var slide = document.createElement('div');
    slide.className = 'header-hero-slide' + (idx === 0 ? ' is-active' : '');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (idx + 1) + ' of ' + totalPortraits + ': ' + portrait.era);

    slide.innerHTML =
      '<img src="' + portrait.image + '" alt="' + portrait.alt + '" class="header-hero-img" loading="' + (idx === 0 ? 'eager' : 'lazy') + '" />';

    slidesContainer.appendChild(slide);

    // Rectangular progress indicator bar
    var bar = document.createElement('button');
    bar.className = 'header-slider-bar' + (idx === 0 ? ' active' : '');
    bar.setAttribute('role', 'tab');
    bar.setAttribute('aria-label', 'View photo ' + (idx + 1) + ': ' + portrait.era);
    bar.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    bar.addEventListener('click', function () {
      goToHeaderSlide(idx);
    });
    dotsContainer.appendChild(bar);
  });

  // Respect OS reduced-motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isAutoplay = false;
    if (pauseBtn) {
      pauseBtn.innerHTML = '<span class="pause-icon" aria-hidden="true">&#9654;</span> <span class="btn-text">Paused</span>';
      pauseBtn.setAttribute('aria-label', 'Resume automatic slide rotation');
    }
  }

  function updateHeaderSlider() {
    var slides = slidesContainer.querySelectorAll('.header-hero-slide');
    slides.forEach(function (s, i) {
      if (i === currentIndex) {
        s.classList.add('is-active');
      } else {
        s.classList.remove('is-active');
      }
    });

    var bars = dotsContainer.querySelectorAll('.header-slider-bar');
    bars.forEach(function (b, i) {
      if (i === currentIndex) {
        b.classList.add('active');
        b.setAttribute('aria-selected', 'true');
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      }
    });

    // Update era badge
    if (eraBadge && headerPortraits[currentIndex]) {
      eraBadge.textContent = headerPortraits[currentIndex].era;
    }
  }

  function goToHeaderSlide(index) {
    currentIndex = (index + totalPortraits) % totalPortraits;
    updateHeaderSlider();
  }

  function nextHeaderSlide() {
    goToHeaderSlide(currentIndex + 1);
  }

  function startAutoplay() {
    if (timer) { clearInterval(timer); }
    if (!isAutoplay) { return; }
    timer = setInterval(nextHeaderSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); }
  }

  // Hover pauses 3-second autoplay for contemplative viewing
  if (headerEl) {
    headerEl.addEventListener('pointerenter', stopAutoplay);
    headerEl.addEventListener('pointerleave', function () {
      if (isAutoplay) { startAutoplay(); }
    });
  }

  // Play/Pause button control
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      isAutoplay = !isAutoplay;
      if (isAutoplay) {
        this.innerHTML = '<span class="pause-icon" aria-hidden="true">&#10074;&#10074;</span> <span class="btn-text">3s Autoplay</span>';
        this.setAttribute('aria-label', 'Pause automatic slide transition');
        startAutoplay();
      } else {
        this.innerHTML = '<span class="pause-icon" aria-hidden="true">&#9654;</span> <span class="btn-text">Paused</span>';
        this.setAttribute('aria-label', 'Resume automatic slide transition');
        stopAutoplay();
      }
    });
  }

  startAutoplay();
}


/* ================================================================
   8. INITIALISE THE PAGE
   Runs once the HTML document is fully parsed and the DOM is ready.
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  renderSources();          // 1. Build the numbered source list first
  renderTimeline();         // 2. Build the milestone timeline
  renderVentureCards('all'); // 3. Build all venture cards (no filter applied)

  // Initialise 3D interaction on all static interactive elements (portrait, stat cards)
  document.querySelectorAll('.interactive-3d').forEach(bind3DTilt);

  // Initialise interactive hero title parallax & ambient background canvas
  initInteractiveHeading();
  initAmbientBackground();

  // Initialise visual showcase slider
  initGallerySlider();

  // Initialise header portrait autoplay slider
  initHeaderSlider();
});


