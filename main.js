(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && mobileNav) {
    const setOpen = (open) => {
      mobileNav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(!mobileNav.classList.contains("is-open"));
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  const QUESTIONS = [
    {
      prompt:
        "Should Landing Field Three expand visitor hospitality capacity for the next festival cycle?",
      aye: "Authorize measured expansion under charter safety review",
      nay: "Retain current capacity; prefer hyperloop redistribution",
    },
    {
      prompt:
        "Should the Ugnaught-maintained droid labor pool be expanded to free more citizen time for arts and civic life?",
      aye: "Grow the pool carefully — abundance as charter infrastructure",
      nay: "Hold scale; prioritize droid rehabilitation and stability first",
    },
  ];

  const form = document.getElementById("charter-ballot");
  if (!form) return;

  let qIndex = 0;
  let castCount = 0;
  const labelEl = document.getElementById("ballot-q-label");
  const promptEl = document.getElementById("ballot-prompt");
  const ayeDesc = document.getElementById("ballot-aye-desc");
  const nayDesc = document.getElementById("ballot-nay-desc");
  const resultEl = document.getElementById("ballot-result");
  const nextBtn = document.getElementById("ballot-next");

  function renderQuestion() {
    const q = QUESTIONS[qIndex];
    if (labelEl) labelEl.textContent = `Sample civic question ${qIndex + 1} of ${QUESTIONS.length}`;
    if (promptEl) promptEl.textContent = q.prompt;
    if (ayeDesc) ayeDesc.textContent = q.aye;
    if (nayDesc) nayDesc.textContent = q.nay;
    form.querySelectorAll('input[name="vote"]').forEach((input) => {
      input.checked = false;
    });
    if (resultEl) {
      resultEl.hidden = true;
      resultEl.textContent = "";
    }
  }

  function showResult(text) {
    if (!resultEl) return;
    resultEl.hidden = false;
    resultEl.innerHTML = text;
  }

  nextBtn?.addEventListener("click", () => {
    qIndex = (qIndex + 1) % QUESTIONS.length;
    renderQuestion();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="vote"]:checked');
    if (!selected) {
      showResult("Select Aye, Nay, or Abstain before casting.");
      return;
    }
    const labels = { aye: "Aye", nay: "Nay", abstain: "Abstain" };
    castCount += 1;
    showResult(
      `Demo ballot recorded: ${labels[selected.value]}. Stored only in this browser — not a real election.<br /><span style="display:block;margin-top:0.35rem;color:var(--faint)">Session demo ballots: ${castCount}</span>`,
    );
  });

  form.addEventListener("reset", (e) => {
    e.preventDefault();
    form.querySelectorAll('input[name="vote"]').forEach((input) => {
      input.checked = false;
    });
    if (resultEl) {
      resultEl.hidden = true;
      resultEl.textContent = "";
    }
  });

  renderQuestion();
})();
