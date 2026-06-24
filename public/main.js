const apiBase = "/api/weekly-reports";

const elements = {
  count: document.querySelector("#report-count"),
  status: document.querySelector("#status-line"),
  list: document.querySelector("#report-list"),
  template: document.querySelector("#report-card-template"),
  filterForm: document.querySelector("#filter-form"),
  clearFilter: document.querySelector("#clear-filter"),
  form: document.querySelector("#report-form"),
  formTitle: document.querySelector("#form-title"),
  submitButton: document.querySelector("#submit-button"),
  resetButton: document.querySelector("#reset-button"),
  id: document.querySelector("#report-id"),
  author: document.querySelector("#author"),
  week: document.querySelector("#week"),
  completed: document.querySelector("#completed"),
  plan: document.querySelector("#plan"),
  blocker: document.querySelector("#blocker"),
  authorFilter: document.querySelector("#author-filter"),
};

let reports = [];

elements.filterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadReports(elements.authorFilter.value);
});

elements.clearFilter.addEventListener("click", async () => {
  elements.authorFilter.value = "";
  await loadReports();
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveReport();
});

elements.resetButton.addEventListener("click", () => {
  resetForm();
});

await loadReports();

async function loadReports(author = "") {
  const query = author.trim()
    ? `?author=${encodeURIComponent(author.trim())}`
    : "";
  setStatus("加载中...");

  try {
    reports = await requestJson(`${apiBase}${query}`);
    renderReports();
    setStatus(reports.length === 0 ? "暂无周报" : "已加载最新周报");
  } catch (error) {
    setStatus(error.message);
  }
}

async function saveReport() {
  const id = elements.id.value;
  const payload = {
    author: elements.author.value,
    week: elements.week.value,
    completed: elements.completed.value,
    plan: elements.plan.value,
    blocker: elements.blocker.value,
  };

  const url = id ? `${apiBase}/${id}` : apiBase;
  const method = id ? "PUT" : "POST";

  try {
    await requestJson(url, {
      method,
      body: JSON.stringify(payload),
    });
    resetForm();
    await loadReports(elements.authorFilter.value);
    setStatus("保存成功");
  } catch (error) {
    setStatus(error.message);
  }
}

function renderReports() {
  elements.count.textContent = String(reports.length);
  elements.list.replaceChildren();

  for (const report of reports) {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    node.querySelector('[data-field="title"]').textContent = report.author;
    node.querySelector('[data-field="summary"]').textContent = formatDate(
      report.updatedAt,
    );
    node.querySelector('[data-field="week"]').textContent = report.week;
    node.querySelector('[data-field="completed"]').textContent =
      report.completed;
    node.querySelector('[data-field="plan"]').textContent = report.plan;
    node.querySelector('[data-field="blocker"]').textContent =
      report.blocker || "无";
    node.querySelector('[data-action="edit"]').addEventListener("click", () => {
      fillForm(report);
    });
    node
      .querySelector('[data-action="delete"]')
      .addEventListener("click", async () => {
        await deleteReport(report);
      });
    elements.list.append(node);
  }
}

function fillForm(report) {
  elements.id.value = report.id;
  elements.author.value = report.author;
  elements.week.value = report.week;
  elements.completed.value = report.completed;
  elements.plan.value = report.plan;
  elements.blocker.value = report.blocker;
  elements.formTitle.textContent = "编辑周报";
  elements.submitButton.textContent = "更新";
}

function resetForm() {
  elements.form.reset();
  elements.id.value = "";
  elements.formTitle.textContent = "新建周报";
  elements.submitButton.textContent = "保存";
}

async function deleteReport(report) {
  const confirmed = window.confirm(`删除 ${report.author} ${report.week}？`);

  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`${apiBase}/${report.id}`, { method: "DELETE" });
    await loadReports(elements.authorFilter.value);
    setStatus("已删除");
  } catch (error) {
    setStatus(error.message);
  }
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = Array.isArray(body.messages)
      ? body.messages.join("；")
      : "请求失败";
    throw new Error(message);
  }

  if (response.status === 204) {
    return {};
  }

  return response.json();
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function setStatus(message) {
  elements.status.textContent = message;
}
