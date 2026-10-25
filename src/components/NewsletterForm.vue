<script setup>
import { computed, inject, onUnmounted, reactive, ref } from 'vue'

const props = defineProps({
  compact: { type: Boolean, default: false },
  source: { type: String, default: '首页' },
})

const toast = inject('toast', null)
const email = ref('')
const agree = ref(true)
const touched = ref(false)
const submitting = ref(false)
const subscribed = ref(false)
const emailInput = ref(null)
let timer = null

const form = reactive({
  interest: '选书手记',
})

const emailError = computed(() => {
  if (!touched.value) return ''
  if (!email.value) return '请留下你的邮箱'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return '这个邮箱看起来不太对'
  return ''
})

function submit() {
  touched.value = true
  if (emailError.value) {
    emailInput.value?.focus()
    return
  }
  if (!agree.value) {
    toast?.push('请先同意接收纸间来信。', { kind: 'warning' })
    return
  }

  submitting.value = true
  timer = setTimeout(() => {
    submitting.value = false
    subscribed.value = true
    toast?.push(`订阅成功，第一封「${form.interest}」会先寄给你。`, {
      title: '纸间来信',
      kind: 'success',
    })
  }, 850)
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <section class="letter" :class="{ 'letter--compact': compact }">
    <div class="letter__stamp" aria-hidden="true">
      <span>纸间</span>
      <small>POST</small>
    </div>

    <div class="letter__content">
      <p class="eyebrow">LETTERS FROM PAPER BETWEEN</p>
      <h2 class="letter__title">订阅纸间来信</h2>
      <p class="letter__desc">
        每两周一封，不追热点，只写最近读到的书、店里的光，以及一段值得抄下来的句子。
      </p>

      <Transition name="fade" mode="out-in">
        <div v-if="subscribed" key="success" class="letter__success">
          <span class="letter__success-mark" aria-hidden="true">✓</span>
          <div>
            <strong>已经放进邮袋了。</strong>
            <p>下一封信会寄到 {{ email }}，请注意查收。</p>
          </div>
        </div>

        <form v-else key="form" class="letter__form" novalidate @submit.prevent="submit">
          <div class="letter__row">
            <div class="letter__field" :class="{ 'has-error': emailError }">
              <label for="letter-email" class="sr-only">邮箱</label>
              <input
                id="letter-email"
                ref="emailInput"
                v-model.trim="email"
                class="input"
                type="email"
                placeholder="你的邮箱地址"
                autocomplete="email"
                @blur="touched = true"
              />
            </div>
            <button type="submit" class="btn btn--clay" :disabled="submitting">
              {{ submitting ? '正在寄出…' : '订阅来信' }}
            </button>
          </div>
          <p v-if="emailError" class="letter__error">{{ emailError }}</p>

          <div class="letter__options">
            <label class="letter__check">
              <input v-model="agree" type="checkbox" />
              <span>我同意接收纸间来信</span>
            </label>
            <label class="letter__select-label">
              <span class="sr-only">选择感兴趣的内容</span>
              <select v-model="form.interest" class="letter__select">
                <option>选书手记</option>
                <option>共读活动</option>
                <option>书店日常</option>
              </select>
            </label>
          </div>
        </form>
      </Transition>

      <p class="letter__note">每月不超过 2 封。随时可以退订。本站为课程练习，不会真的发送邮件。</p>
    </div>
  </section>
</template>

<style scoped>
.letter {
  position: relative;
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 38px;
  padding: 54px 58px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at 100% 0, rgba(211, 163, 75, 0.16), transparent 40%),
    var(--paper-soft);
  overflow: hidden;
}

.letter::after {
  content: '';
  position: absolute;
  right: -50px;
  bottom: -80px;
  width: 220px;
  height: 220px;
  border: 1px solid var(--line);
  border-radius: 50%;
  opacity: 0.7;
  pointer-events: none;
}

.letter__stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: start;
  width: 82px;
  height: 98px;
  border: 1.5px dashed var(--clay);
  color: var(--clay);
  transform: rotate(-3deg);
}

.letter__stamp span {
  font-family: var(--font-display);
  font-size: 19px;
  letter-spacing: 0.1em;
}

.letter__stamp small {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 7px;
  letter-spacing: 0.25em;
}

.letter__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.letter__content .eyebrow {
  margin-bottom: 12px;
}

.letter__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.6vw, 2.9rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.letter__desc {
  max-width: 560px;
  margin: 13px 0 24px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.9;
}

.letter__row {
  display: flex;
  gap: 10px;
}

.letter__field {
  flex: 1;
  min-width: 0;
}

.letter__field .input {
  min-height: 48px;
  border-radius: 999px;
  padding-inline: 20px;
  background: var(--cream);
}

.letter__field.has-error .input {
  border-color: var(--clay);
}

.letter__row .btn {
  min-height: 48px;
  flex: none;
}

.letter__error {
  margin: 7px 0 0 20px;
  color: var(--clay);
  font-size: 11px;
}

.letter__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 13px;
}

.letter__check {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 10.5px;
  cursor: pointer;
}

.letter__check input {
  width: 13px;
  height: 13px;
  accent-color: var(--forest);
}

.letter__select {
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--ink-soft);
  font-size: 10.5px;
  padding: 2px 16px 2px 2px;
  cursor: pointer;
}

.letter__note {
  margin: 15px 0 0;
  color: var(--ink-faint);
  font-size: 9.5px;
}

.letter__success {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid rgba(109, 132, 118, 0.35);
  border-radius: 14px;
  background: rgba(109, 132, 118, 0.08);
}

.letter__success-mark {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--forest);
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 15px;
}

.letter__success strong {
  display: block;
  font-size: 13px;
}

.letter__success p {
  margin: 2px 0 0;
  color: var(--ink-soft);
  font-size: 11px;
}

.letter--compact {
  grid-template-columns: 1fr;
  gap: 0;
  padding: 34px;
}

.letter--compact .letter__stamp {
  position: absolute;
  top: 22px;
  right: 24px;
  width: 54px;
  height: 66px;
  opacity: 0.7;
}

.letter--compact .letter__title {
  font-size: 26px;
}

.letter--compact .letter__desc {
  margin-bottom: 18px;
  font-size: 12px;
}

@media (max-width: 720px) {
  .letter {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 34px 26px;
  }

  .letter__stamp {
    position: absolute;
    top: 26px;
    right: 26px;
    width: 58px;
    height: 70px;
    opacity: 0.6;
  }

  .letter__desc {
    padding-right: 40px;
  }

  .letter__row {
    flex-direction: column;
  }

  .letter__row .btn {
    width: 100%;
  }

  .letter__options {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
