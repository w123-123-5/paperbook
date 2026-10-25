<script setup>
import { computed, inject, onUnmounted, reactive, ref } from 'vue'

const toast = inject('toast', null)

const form = reactive({
  name: '',
  email: '',
  topic: '随便聊聊',
  message: '',
  reply: true,
})

const touched = reactive({
  name: false,
  email: false,
  message: false,
})

const submitting = ref(false)
const submitted = ref(false)
let timer = null

const errors = computed(() => {
  const result = {}
  if (!form.name.trim()) result.name = '怎么称呼你？'
  if (!form.email.trim()) result.email = '留一个能收到回信的邮箱'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) result.email = '邮箱格式好像不太对'
  if (!form.message.trim()) result.message = '想说的话，写一句也可以'
  return result
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

function submit() {
  Object.keys(touched).forEach((key) => (touched[key] = true))
  if (hasErrors.value) {
    toast?.push('还有几处没填完，检查一下标红的地方。', { kind: 'warning' })
    return
  }
  submitting.value = true
  timer = setTimeout(() => {
    submitting.value = false
    submitted.value = true
    toast?.push('信已经放进门前的邮筒，我们会尽快回你。', {
      title: '寄信成功',
      kind: 'success',
    })
  }, 750)
}

function reset() {
  form.name = ''
  form.email = ''
  form.topic = '随便聊聊'
  form.message = ''
  form.reply = true
  Object.keys(touched).forEach((key) => (touched[key] = false))
  submitted.value = false
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="contact">
    <Transition name="fade" mode="out-in">
      <div v-if="submitted" key="sent" class="contact__sent">
        <span class="contact__sent-mark" aria-hidden="true">✓</span>
        <p class="eyebrow">LETTER RECEIVED</p>
        <h2>信收到了。</h2>
        <p>
          {{ form.name }}，谢谢你写来关于「{{ form.topic }}」的信。
          {{ form.reply ? '我们会回到你留下的邮箱。' : '我们会把它放在心里，不打扰你。' }}
        </p>
        <button type="button" class="btn btn--ghost btn--small" @click="reset">再写一封</button>
      </div>

      <form v-else key="form" class="contact__form" novalidate @submit.prevent="submit">
        <div class="contact__row">
          <label class="field">
            <span class="field__label">怎么称呼你 *</span>
            <input
              v-model.trim="form.name"
              class="input"
              type="text"
              placeholder="你的名字"
              maxlength="20"
              @blur="touched.name = true"
            />
            <span v-if="touched.name && errors.name" class="contact__error">{{ errors.name }}</span>
          </label>

          <label class="field">
            <span class="field__label">邮箱 *</span>
            <input
              v-model.trim="form.email"
              class="input"
              type="email"
              placeholder="hello@example.com"
              autocomplete="email"
              @blur="touched.email = true"
            />
            <span v-if="touched.email && errors.email" class="contact__error">{{ errors.email }}</span>
          </label>
        </div>

        <label class="field">
          <span class="field__label">想聊什么</span>
          <select v-model="form.topic" class="select">
            <option>随便聊聊</option>
            <option>推荐一本书</option>
            <option>活动合作</option>
            <option>场地借用</option>
            <option>我想来打工</option>
          </select>
        </label>

        <label class="field">
          <span class="field__label">想说的话 *</span>
          <textarea
            v-model.trim="form.message"
            class="textarea"
            placeholder="最近在读什么？或者，只是路过想打个招呼。"
            maxlength="500"
            @blur="touched.message = true"
          />
          <span class="contact__counter">{{ form.message.length }} / 500</span>
          <span v-if="touched.message && errors.message" class="contact__error">{{ errors.message }}</span>
        </label>

        <label class="contact__check">
          <input v-model="form.reply" type="checkbox" />
          <span>希望收到回信</span>
        </label>

        <div class="contact__foot">
          <button type="submit" class="btn btn--primary" :disabled="submitting">
            {{ submitting ? '正在投递…' : '把信寄出' }}
            <span aria-hidden="true">→</span>
          </button>
          <span>我们通常在 2–3 个工作日内回信。</span>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.contact {
  min-height: 440px;
}

.contact__form {
  display: grid;
  gap: 17px;
}

.contact__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}

.field {
  position: relative;
}

.contact__form :deep(.input),
.contact__form :deep(.select),
.contact__form :deep(.textarea) {
  background: var(--cream);
}

.contact__form :deep(.textarea) {
  min-height: 150px;
}

.contact__error {
  color: var(--clay);
  font-size: 9.5px;
  line-height: 1.5;
}

.contact__counter {
  justify-self: end;
  margin-top: -3px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
}

.contact__check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-soft);
  font-size: 11px;
  cursor: pointer;
}

.contact__check input {
  width: 14px;
  height: 14px;
  accent-color: var(--forest);
}

.contact__foot {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 5px;
}

.contact__foot span {
  color: var(--ink-faint);
  font-size: 9.5px;
}

.contact__sent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 430px;
}

.contact__sent-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 23px;
  border-radius: 50%;
  background: var(--forest);
  color: var(--cream);
  font-family: var(--font-mono);
  font-size: 18px;
}

.contact__sent .eyebrow {
  margin-bottom: 10px;
}

.contact__sent h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
}

.contact__sent p {
  max-width: 480px;
  margin: 15px 0 25px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.9;
}

@media (max-width: 620px) {
  .contact__row {
    grid-template-columns: 1fr;
  }

  .contact__foot {
    align-items: flex-start;
    flex-direction: column;
    gap: 9px;
  }
}
</style>
