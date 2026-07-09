'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './admin.module.scss'

type LeadStatus = 'new' | 'in_progress' | 'done' | 'archived'
type ProjectStage =
  | 'lead'
  | 'brief'
  | 'estimate'
  | 'prepayment'
  | 'design'
  | 'development'
  | 'content'
  | 'review'
  | 'launch'
  | 'support'
  | 'closed'

type LeadComment = {
  id: string
  text: string
  createdAt: string
}

type Lead = {
  id: string
  createdAt: string
  updatedAt: string
  status: LeadStatus
  isCompleted: boolean
  isPaid: boolean
  income: number
  taxPercent?: number
  projectStage?: ProjectStage
  comments: LeadComment[]
  name: string
  phone: string
  email: string
  contact: string
  service: string
  message: string
  page: string
  source: string
  sourceLabel: string
  sourceType?: string
  manualSource?: string
  sourceUrl: string
  landingPage: string
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  yclid: string
  gclid: string
}

type Summary = {
  total: number
  new: number
  inProgress: number
  completed: number
  paid: number
  income: number
  expenses: number
  tax: number
  profit: number
  netProfit: number
}

type AdminResponse = {
  ok: boolean
  leads: Lead[]
  expenses: BusinessExpense[]
  articles: PublishedArticle[]
  summary: Summary
}

type ManualLeadForm = {
  name: string
  contact: string
  service: string
  sourceType: LeadSourceType
  manualSource: string
  message: string
  projectStage: ProjectStage
}

type BusinessExpense = {
  id: string
  title: string
  amount: number
  category: string
  createdAt: string
}

type ExpenseForm = {
  title: string
  amount: string
  category: string
}

type PublishedArticle = {
  id: string
  title: string
  platform: string
  url: string
  status: string
  note: string
  publishedAt: string
  createdAt: string
}

type ArticleForm = {
  title: string
  platform: string
  url: string
  status: string
  note: string
}

type LeadSourceType = 'ads' | 'seo' | 'referral' | 'direct' | 'manual' | 'other'
type AdminSection = 'summary' | 'expenses' | 'articles' | 'leads'
type AdminTheme = 'light' | 'dark'

const statusLabels: Record<LeadStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  archived: 'Архив',
}

const statusOptions = Object.entries(statusLabels) as Array<[LeadStatus, string]>

const stageLabels: Record<ProjectStage, string> = {
  lead: 'Лид',
  brief: 'Бриф',
  estimate: 'Оценка',
  prepayment: 'Предоплата',
  design: 'Дизайн',
  development: 'Разработка',
  content: 'Контент',
  review: 'Проверка',
  launch: 'Запуск',
  support: 'Поддержка',
  closed: 'Закрыт',
}

const stageOptions = Object.entries(stageLabels) as Array<[ProjectStage, string]>

const emptySummary: Summary = {
  total: 0,
  new: 0,
  inProgress: 0,
  completed: 0,
  paid: 0,
  income: 0,
  expenses: 0,
  tax: 0,
  profit: 0,
  netProfit: 0,
}

const emptyManualLeadForm: ManualLeadForm = {
  name: '',
  contact: '',
  service: '',
  sourceType: 'manual',
  manualSource: '',
  message: '',
  projectStage: 'lead',
}

const emptyExpenseForm: ExpenseForm = {
  title: '',
  amount: '',
  category: '',
}

const emptyArticleForm: ArticleForm = {
  title: '',
  platform: '',
  url: '',
  status: 'Опубликована',
  note: '',
}

const sourceLabels: Record<LeadSourceType, string> = {
  ads: 'Реклама',
  seo: 'SEO',
  referral: 'Сарафанка',
  direct: 'Прямой заход',
  manual: 'Вручную',
  other: 'Другое',
}

const sourceOptions = Object.entries(sourceLabels) as Array<[LeadSourceType, string]>

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [expenses, setExpenses] = useState<BusinessExpense[]>([])
  const [articles, setArticles] = useState<PublishedArticle[]>([])
  const [summary, setSummary] = useState<Summary>(emptySummary)
  const [selectedId, setSelectedId] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [query, setQuery] = useState('')
  const [comment, setComment] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [theme, setTheme] = useState<AdminTheme>('light')
  const [openSections, setOpenSections] = useState<Record<AdminSection, boolean>>({
    summary: true,
    expenses: true,
    articles: true,
    leads: true,
  })
  const [manualLead, setManualLead] = useState<ManualLeadForm>(emptyManualLeadForm)
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(emptyExpenseForm)
  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticleForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void loadLeads()
  }, [])

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        [
          lead.name,
          lead.phone,
          lead.email,
          lead.contact,
          lead.service,
          lead.message,
          lead.sourceLabel,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [leads, query, statusFilter])

  const selectedLead = useMemo(() => {
    return leads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? null
  }, [filteredLeads, leads, selectedId])

  useEffect(() => {
    if (!selectedId && filteredLeads[0]) {
      setSelectedId(filteredLeads[0].id)
    }
  }, [filteredLeads, selectedId])

  async function loadLeads() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/leads', { cache: 'no-store' })
      if (!response.ok) throw new Error('Не удалось загрузить заявки')

      const data = (await response.json()) as AdminResponse
      setLeads(data.leads)
      setExpenses(data.expenses)
      setArticles(data.articles)
      setSummary(data.summary)
      setSelectedId((current) => current || data.leads[0]?.id || '')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  async function updateLead(lead: Lead, patch: Partial<Lead>) {
    setSaving(true)
    setError('')

    const previousLeads = leads
    const nextLead = { ...lead, ...patch, updatedAt: new Date().toISOString() }
    setLeads((current) => current.map((item) => (item.id === lead.id ? nextLead : item)))

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })

      if (!response.ok) throw new Error('Не удалось сохранить изменения')

      await loadLeads()
    } catch (saveError) {
      setLeads(previousLeads)
      setError(saveError instanceof Error ? saveError.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  async function addComment() {
    if (!selectedLead || !comment.trim()) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment }),
      })

      if (!response.ok) throw new Error('Не удалось добавить комментарий')

      setComment('')
      await loadLeads()
    } catch (commentError) {
      setError(commentError instanceof Error ? commentError.message : 'Ошибка комментария')
    } finally {
      setSaving(false)
    }
  }

  async function createManualLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualLead,
          sourceLabel:
            manualLead.manualSource.trim() ||
            sourceLabels[manualLead.sourceType] ||
            'Добавлено вручную',
        }),
      })

      if (!response.ok) throw new Error('Не удалось создать заявку')

      const data = (await response.json()) as { ok: boolean; lead: Lead }
      setManualLead(emptyManualLeadForm)
      setCreateOpen(false)
      await loadLeads()
      setSelectedId(data.lead.id)
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Ошибка создания заявки')
    } finally {
      setSaving(false)
    }
  }

  function updateManualLead<Key extends keyof ManualLeadForm>(
    key: Key,
    value: ManualLeadForm[Key],
  ) {
    setManualLead((current) => ({ ...current, [key]: value }))
  }

  async function createBusinessExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseForm,
          amount: Number(expenseForm.amount) || 0,
        }),
      })

      if (!response.ok) throw new Error('Не удалось добавить расход')

      setExpenseForm(emptyExpenseForm)
      await loadLeads()
    } catch (expenseError) {
      setError(expenseError instanceof Error ? expenseError.message : 'Ошибка расхода')
    } finally {
      setSaving(false)
    }
  }

  async function removeBusinessExpense(id: string) {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Не удалось удалить расход')

      await loadLeads()
    } catch (expenseError) {
      setError(expenseError instanceof Error ? expenseError.message : 'Ошибка удаления расхода')
    } finally {
      setSaving(false)
    }
  }

  function updateExpense<Key extends keyof ExpenseForm>(key: Key, value: ExpenseForm[Key]) {
    setExpenseForm((current) => ({ ...current, [key]: value }))
  }

  async function createPublishedArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm),
      })

      if (!response.ok) throw new Error('Не удалось добавить статью')

      setArticleForm(emptyArticleForm)
      await loadLeads()
    } catch (articleError) {
      setError(articleError instanceof Error ? articleError.message : 'Ошибка статьи')
    } finally {
      setSaving(false)
    }
  }

  async function removePublishedArticle(id: string) {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Не удалось удалить статью')

      await loadLeads()
    } catch (articleError) {
      setError(articleError instanceof Error ? articleError.message : 'Ошибка удаления статьи')
    } finally {
      setSaving(false)
    }
  }

  function updateArticle<Key extends keyof ArticleForm>(key: Key, value: ArticleForm[Key]) {
    setArticleForm((current) => ({ ...current, [key]: value }))
  }

  function toggleSection(section: AdminSection) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }))
  }

  return (
    <main className={styles.page} data-theme={theme}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Project 42 CRM</p>
          <h1>Заявки и финансы</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setCreateOpen((current) => !current)}
          >
            {createOpen ? 'Скрыть форму' : 'Добавить заявку'}
          </button>
          <button
            className={styles.refreshButton}
            type="button"
            onClick={loadLeads}
            disabled={loading}
          >
            Обновить
          </button>
        </div>
      </header>

      {createOpen && (
        <section className={styles.createPanel} aria-labelledby="create-lead-title">
          <div>
            <p className={styles.eyebrow}>Новая запись</p>
            <h2 id="create-lead-title">Добавить заявку вручную</h2>
          </div>
          <form className={styles.createForm} onSubmit={createManualLead}>
            <label>
              Имя / компания
              <input
                value={manualLead.name}
                onChange={(event) => updateManualLead('name', event.target.value)}
                placeholder="Например, Анна или ООО Ромашка"
              />
            </label>
            <label>
              Контакт
              <input
                value={manualLead.contact}
                onChange={(event) => updateManualLead('contact', event.target.value)}
                placeholder="Телефон, @telegram, email"
              />
            </label>
            <label>
              Услуга
              <input
                value={manualLead.service}
                onChange={(event) => updateManualLead('service', event.target.value)}
                placeholder="Сайт, SEO, поддержка"
              />
            </label>
            <label>
              Стадия
              <select
                value={manualLead.projectStage}
                onChange={(event) =>
                  updateManualLead('projectStage', event.target.value as ProjectStage)
                }
              >
                {stageOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Тип источника
              <select
                value={manualLead.sourceType}
                onChange={(event) =>
                  updateManualLead('sourceType', event.target.value as LeadSourceType)
                }
              >
                {sourceOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Уточнение источника
              <input
                value={manualLead.manualSource}
                onChange={(event) => updateManualLead('manualSource', event.target.value)}
                placeholder="Например, рекомендация от Ивана"
              />
            </label>
            <label className={styles.createMessage}>
              Комментарий / задача
              <textarea
                value={manualLead.message}
                onChange={(event) => updateManualLead('message', event.target.value)}
                placeholder="Что нужно сделать, откуда пришел клиент, важные договоренности"
                rows={4}
              />
            </label>
            <div className={styles.createActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => setCreateOpen(false)}
              >
                Отмена
              </button>
              <button className={styles.primaryButton} type="submit" disabled={saving}>
                Создать заявку
              </button>
            </div>
          </form>
        </section>
      )}

      <section className={styles.dashboardPanel} aria-labelledby="summary-title">
        <SectionHeader
          count={summary.total}
          eyebrow="Сводка"
          id="summary-title"
          open={openSections.summary}
          title="Финансы и заявки"
          onToggle={() => toggleSection('summary')}
        />
        {openSections.summary && (
          <div className={styles.metrics} aria-label="Сводка">
            <Metric label="Всего заявок" value={summary.total.toString()} />
            <Metric label="Новые" value={summary.new.toString()} tone="yellow" />
            <Metric label="В работе" value={summary.inProgress.toString()} tone="blue" />
            <Metric label="Оплачено" value={summary.paid.toString()} tone="mint" />
            <Metric label="Доход" value={formatMoney(summary.income)} />
            <Metric label="Налог" value={formatMoney(summary.tax)} />
            <Metric label="Общие затраты" value={formatMoney(summary.expenses)} />
            <Metric
              label="Чистая прибыль"
              value={formatMoney(summary.netProfit)}
              tone={summary.netProfit >= 0 ? 'mint' : 'red'}
            />
          </div>
        )}
      </section>

      <section className={styles.expensesPanel} aria-labelledby="expenses-title">
        <SectionHeader
          count={formatMoney(summary.expenses)}
          eyebrow="Бизнес-расходы"
          id="expenses-title"
          open={openSections.expenses}
          title="Общие затраты"
          onToggle={() => toggleSection('expenses')}
        />
        {openSections.expenses && (
          <>
            <form className={styles.expenseForm} onSubmit={createBusinessExpense}>
              <label>
                Расход
                <input
                  value={expenseForm.title}
                  onChange={(event) => updateExpense('title', event.target.value)}
                  placeholder="Реклама, ноутбук, GPT"
                />
              </label>
              <label>
                Сумма
                <input
                  inputMode="decimal"
                  min="0"
                  type="number"
                  value={expenseForm.amount}
                  onChange={(event) => updateExpense('amount', event.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Категория
                <input
                  value={expenseForm.category}
                  onChange={(event) => updateExpense('category', event.target.value)}
                  placeholder="Маркетинг, техника, подписки"
                />
              </label>
              <button className={styles.primaryButton} type="submit" disabled={saving}>
                Добавить расход
              </button>
            </form>
            <div className={styles.expenseList}>
              {expenses.length === 0 && (
                <p className={styles.emptyInline}>Общих затрат пока нет.</p>
              )}
              {expenses.map((expense) => (
                <article className={styles.expenseItem} key={expense.id}>
                  <span>
                    <strong>{expense.title}</strong>
                    <small>
                      {[expense.category, formatDate(expense.createdAt)]
                        .filter(Boolean)
                        .join(' · ')}
                    </small>
                  </span>
                  <strong>{formatMoney(expense.amount)}</strong>
                  <button
                    type="button"
                    onClick={() => removeBusinessExpense(expense.id)}
                    disabled={saving}
                  >
                    Удалить
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className={styles.articlesPanel} aria-labelledby="articles-title">
        <SectionHeader
          count={articles.length}
          eyebrow="Контент"
          id="articles-title"
          open={openSections.articles}
          title="Написанные статьи"
          onToggle={() => toggleSection('articles')}
        />
        {openSections.articles && (
          <>
            <form className={styles.articleForm} onSubmit={createPublishedArticle}>
              <label>
                Название
                <input
                  value={articleForm.title}
                  onChange={(event) => updateArticle('title', event.target.value)}
                  placeholder="Название статьи"
                />
              </label>
              <label>
                Где опубликована
                <input
                  value={articleForm.platform}
                  onChange={(event) => updateArticle('platform', event.target.value)}
                  placeholder="Сайт, VC, Дзен, Telegram"
                />
              </label>
              <label>
                Ссылка
                <input
                  value={articleForm.url}
                  onChange={(event) => updateArticle('url', event.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label>
                Статус
                <input
                  value={articleForm.status}
                  onChange={(event) => updateArticle('status', event.target.value)}
                  placeholder="Опубликована"
                />
              </label>
              <label className={styles.articleNote}>
                Заметка
                <input
                  value={articleForm.note}
                  onChange={(event) => updateArticle('note', event.target.value)}
                  placeholder="Кластер, цель, результат"
                />
              </label>
              <button className={styles.primaryButton} type="submit" disabled={saving}>
                Добавить статью
              </button>
            </form>
            <div className={styles.articleList}>
              {articles.length === 0 && <p className={styles.emptyInline}>Статей пока нет.</p>}
              {articles.map((article) => (
                <article className={styles.articleItem} key={article.id}>
                  <span>
                    <strong>{article.title}</strong>
                    <small>
                      {[article.platform, article.status, formatDate(article.createdAt)]
                        .filter(Boolean)
                        .join(' · ')}
                    </small>
                    {article.note && <small>{article.note}</small>}
                  </span>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Открыть
                  </a>
                  <button
                    type="button"
                    onClick={() => removePublishedArticle(article.id)}
                    disabled={saving}
                  >
                    Удалить
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className={styles.leadsPanel} aria-labelledby="leads-title">
        <SectionHeader
          count={filteredLeads.length}
          eyebrow="Работа"
          id="leads-title"
          open={openSections.leads}
          title="Заявки и проекты"
          onToggle={() => toggleSection('leads')}
        />
        {openSections.leads && (
          <div className={styles.workspace}>
            <div className={styles.listPane}>
              <div className={styles.toolbar}>
                <input
                  aria-label="Поиск по заявкам"
                  placeholder="Поиск: имя, контакт, услуга"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <select
                  aria-label="Фильтр по статусу"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'all' | LeadStatus)}
                >
                  <option value="all">Все статусы</option>
                  {statusOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {loading && <p className={styles.empty}>Загружаю заявки...</p>}
              {!loading && filteredLeads.length === 0 && (
                <p className={styles.empty}>Пока нет заявок под выбранные условия.</p>
              )}

              <div className={styles.leadList}>
                {filteredLeads.map((lead) => (
                  <button
                    className={`${styles.leadRow} ${selectedLead?.id === lead.id ? styles.activeLead : ''}`}
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                  >
                    <span>
                      <strong>{lead.name || 'Без имени'}</strong>
                      <small>{getContactLine(lead)}</small>
                    </span>
                    <span className={`${styles.statusBadge} ${styles[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                    <span className={styles.rowMeta}>
                      <span>{formatDate(lead.createdAt)}</span>
                      <span>{getLeadSourceLabel(lead)}</span>
                      <span>{stageLabels[getProjectStage(lead)]}</span>
                      <span>{formatMoney(getLeadNetProfit(lead))}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <aside className={styles.detailPane} aria-label="Детали заявки">
              {selectedLead ? (
                <>
                  <div className={styles.detailHeader}>
                    <div>
                      <p className={styles.eyebrow}>{formatDateTime(selectedLead.createdAt)}</p>
                      <h2>{selectedLead.name || 'Заявка без имени'}</h2>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[selectedLead.status]}`}>
                      {statusLabels[selectedLead.status]}
                    </span>
                  </div>

                  <div className={styles.controlsGrid}>
                    <label>
                      Стадия проекта
                      <select
                        value={getProjectStage(selectedLead)}
                        onChange={(event) =>
                          updateLead(selectedLead, {
                            projectStage: event.target.value as ProjectStage,
                          })
                        }
                        disabled={saving}
                      >
                        {stageOptions.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Статус
                      <select
                        value={selectedLead.status}
                        onChange={(event) =>
                          updateLead(selectedLead, { status: event.target.value as LeadStatus })
                        }
                        disabled={saving}
                      >
                        {statusOptions.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Toggle
                      checked={selectedLead.isCompleted}
                      label="Выполнена"
                      onChange={(checked) =>
                        updateLead(selectedLead, {
                          isCompleted: checked,
                          status: checked ? 'done' : selectedLead.status,
                        })
                      }
                    />
                    <Toggle
                      checked={selectedLead.isPaid}
                      label="Оплачена"
                      onChange={(checked) => updateLead(selectedLead, { isPaid: checked })}
                    />
                    <MoneyInput
                      label="Доход"
                      value={selectedLead.income}
                      onCommit={(income) => updateLead(selectedLead, { income })}
                    />
                    <MoneyInput
                      label="Налог, %"
                      suffix="%"
                      value={selectedLead.taxPercent ?? 0}
                      onCommit={(taxPercent) => updateLead(selectedLead, { taxPercent })}
                    />
                    <div className={styles.profitBox}>
                      <span>Налог</span>
                      <strong>{formatMoney(getLeadTax(selectedLead))}</strong>
                    </div>
                    <div className={styles.profitBox}>
                      <span>Чистая прибыль</span>
                      <strong>{formatMoney(getLeadNetProfit(selectedLead))}</strong>
                    </div>
                  </div>

                  <section className={styles.stagePanel} aria-labelledby="project-stage-title">
                    <div className={styles.stageHeader}>
                      <div>
                        <p className={styles.eyebrow}>Ход проекта</p>
                        <h3 id="project-stage-title">
                          {stageLabels[getProjectStage(selectedLead)]}
                        </h3>
                      </div>
                      <span>
                        {getStageIndex(getProjectStage(selectedLead)) + 1} / {stageOptions.length}
                      </span>
                    </div>
                    <ol className={styles.stageList}>
                      {stageOptions.map(([stage, label], index) => {
                        const currentIndex = getStageIndex(getProjectStage(selectedLead))
                        const isDone = index < currentIndex
                        const isCurrent = index === currentIndex

                        return (
                          <li
                            className={`${isDone ? styles.stageDone : ''} ${isCurrent ? styles.stageCurrent : ''}`}
                            key={stage}
                          >
                            <button
                              type="button"
                              onClick={() => updateLead(selectedLead, { projectStage: stage })}
                              disabled={saving}
                            >
                              <span>{index + 1}</span>
                              {label}
                            </button>
                          </li>
                        )
                      })}
                    </ol>
                  </section>

                  <dl className={styles.infoGrid}>
                    <Info label="Телефон" value={selectedLead.phone} />
                    <Info label="Email" value={selectedLead.email} />
                    <Info label="Контакт" value={selectedLead.contact} />
                    <Info label="Услуга" value={selectedLead.service} />
                    <Info label="Источник" value={getLeadSourceLabel(selectedLead)} />
                    <Info
                      label="Страница"
                      value={selectedLead.page || selectedLead.sourceUrl}
                      wide
                    />
                    <Info label="UTM" value={formatUtm(selectedLead)} wide />
                    <Info label="Сообщение" value={selectedLead.message} wide />
                  </dl>

                  <section className={styles.comments}>
                    <h3>Комментарии</h3>
                    <div className={styles.commentList}>
                      {selectedLead.comments.length === 0 && (
                        <p className={styles.emptyComment}>Комментариев пока нет.</p>
                      )}
                      {selectedLead.comments.map((item) => (
                        <article className={styles.comment} key={item.id}>
                          <time>{formatDateTime(item.createdAt)}</time>
                          <p>{item.text}</p>
                        </article>
                      ))}
                    </div>
                    <label className={styles.commentForm}>
                      Новый комментарий
                      <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Что сделано, что обещали, когда оплатит..."
                        rows={4}
                      />
                    </label>
                    <button
                      className={styles.primaryButton}
                      type="button"
                      onClick={addComment}
                      disabled={saving}
                    >
                      Добавить комментарий
                    </button>
                  </section>
                </>
              ) : (
                <p className={styles.empty}>Выберите заявку слева.</p>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

function SectionHeader({
  count,
  eyebrow,
  id,
  open,
  title,
  onToggle,
}: {
  count: number | string
  eyebrow: string
  id: string
  open: boolean
  title: string
  onToggle: () => void
}) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      <div className={styles.sectionHeaderActions}>
        <strong>{count}</strong>
        <button
          aria-controls={id}
          aria-expanded={open}
          className={styles.sectionToggle}
          type="button"
          onClick={onToggle}
        >
          {open ? 'Свернуть' : 'Открыть'}
        </button>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'yellow' | 'blue' | 'mint' | 'red'
}) {
  return (
    <article className={`${styles.metric} ${styles[tone]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={styles.toggle}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

function MoneyInput({
  label,
  suffix,
  value,
  onCommit,
}: {
  label: string
  suffix?: string
  value: number
  onCommit: (value: number) => void
}) {
  const [draft, setDraft] = useState(String(value || ''))

  useEffect(() => {
    setDraft(String(value || ''))
  }, [value])

  return (
    <label>
      {label}
      <input
        inputMode="decimal"
        min="0"
        type="number"
        value={draft}
        onBlur={() => onCommit(Number(draft) || 0)}
        onChange={(event) => setDraft(event.target.value)}
      />
      {suffix && <small>{suffix}</small>}
    </label>
  )
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  if (!value) return null

  return (
    <div className={wide ? styles.wideInfo : undefined}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function getContactLine(lead: Lead) {
  return lead.phone || lead.email || lead.contact || 'Контакт не указан'
}

function getLeadSourceLabel(lead: Lead) {
  if (lead.manualSource) return lead.manualSource

  const sourceType = getLeadSourceType(lead)

  if (sourceType === 'other') {
    return lead.sourceLabel || lead.source || lead.referrer || 'Другое'
  }

  return sourceLabels[sourceType]
}

function getLeadSourceType(lead: Lead): LeadSourceType {
  if (isLeadSourceType(lead.sourceType)) return lead.sourceType
  if (lead.source === 'manual_admin') return 'manual'

  const utmSource = (lead.utmSource || '').toLowerCase()
  const utmMedium = (lead.utmMedium || '').toLowerCase()
  const referrer = (lead.referrer || '').toLowerCase()
  const sourceLabel = `${lead.source} ${lead.sourceLabel}`.toLowerCase()

  if (lead.yclid || lead.gclid) return 'ads'
  if (
    /(cpc|ppc|paid|direct|ads|ad|rsya|yandex|google|vk|target)/u.test(`${utmSource} ${utmMedium}`)
  ) {
    return 'ads'
  }
  if (/(organic|seo|search|yandex|google|bing)/u.test(`${utmSource} ${utmMedium} ${referrer}`)) {
    return 'seo'
  }
  if (
    /(referral|recommend|word|сараф|рекоменд)/u.test(`${utmSource} ${utmMedium} ${sourceLabel}`)
  ) {
    return 'referral'
  }
  if (!lead.utmSource && !lead.utmMedium && !lead.referrer) return 'direct'

  return 'other'
}

function isLeadSourceType(value: string | undefined): value is LeadSourceType {
  return Boolean(value && value in sourceLabels)
}

function getProjectStage(lead: Lead) {
  return lead.projectStage ?? 'lead'
}

function getStageIndex(stage: ProjectStage) {
  return Math.max(
    0,
    stageOptions.findIndex(([value]) => value === stage),
  )
}

function getLeadTax(lead: Lead) {
  const income = Number(lead.income) || 0
  const taxPercent = Number(lead.taxPercent) || 0

  return Math.max(0, income * (taxPercent / 100))
}

function getLeadNetProfit(lead: Lead) {
  const income = Number(lead.income) || 0

  return income - getLeadTax(lead)
}

function formatUtm(lead: Lead) {
  return [
    ['source', lead.utmSource],
    ['medium', lead.utmMedium],
    ['campaign', lead.utmCampaign],
    ['term', lead.utmTerm],
    ['content', lead.utmContent],
    ['yclid', lead.yclid],
    ['gclid', lead.gclid],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
