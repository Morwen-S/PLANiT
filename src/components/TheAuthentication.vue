<template>
  <div>
    <app-card class="auth-card">
      <div class="auth-card-logo">PLANiT</div>
      <div class="auth-card-title">{{ isSignUp ? 'Sign Up' : 'Log In'}}</div>
      <div>
        <app-btn @click="signByGoogle" width="100%" outlined>
          <i class="fab fa-google" style="margin-right: 5px"></i>
          Go with Google
        </app-btn>
      </div>
      <div class="auth-card-or-section">
        <app-divider/>
        <span>OR</span>
        <app-divider/>
      </div>
      <form @submit.prevent="auth" class="auth-card-email-section">
        <span>Email</span>
        <app-text-field
          v-model.trim="email"
          :error="!isEmailValid"
          style="margin-bottom: 10px"
          @update:modelValue="refreshValidation"
          type="email"
        />
        <span>Password</span>
        <app-text-field
          v-model.trim="password"
          :error="!isPasswordValid"
          style="margin-bottom: 10px"
          type="password"
          @update:modelValue="refreshValidation"
        />
        <span v-if="isSignUp">Repeat password</span>
        <app-text-field
          v-if="isSignUp"
          :error="!isPasswordValid"
          v-model.trim="repeatPassword"
          style="margin-bottom: 10px"
          type="password"
          @update:modelValue="refreshValidation"
        />
        <app-btn v-if="!isLoading" width="100%" @click="auth">
          {{ isSignUp ? 'Sign Up with Email' : 'Log in'}}
        </app-btn>
      </form>
      <div v-if="isLoading" class="centered">
        <app-loader/>
      </div>
      <div>
        <app-divider/>
      </div>
      <span class="centered auth-card-to-mode">{{ isSignUp ? 'Already signed up?' : 'Don\'t have an account?'}}
        <app-btn icon @click="switchMode">{{ isSignUp ? 'Go to login' : 'Sign Up'}}</app-btn>
      </span>
    </app-card>
    <app-card v-if="errorMessage" class="error-card" :style="{ width: 400 + 'px' }">
      <i class="fas fa-exclamation-circle"></i>
      {{ errorMessage }}
    </app-card>
  </div>
</template>

<script>
import AppTextField from '@/components/UI/AppTextField'
import AppCard from '@/components/UI/AppCard'
import AppLoader from '@/components/UI/AppLoader'

import { signIn, signUp, signInGoogle } from '@/api/authentication'

export default {
  name: 'TheAuthentication',
  components: {
    AppCard,
    AppLoader,
    AppTextField
  },
  emits: ['signIn'],
  computed: {
  },
  data () {
    return {
      isLoading: false,
      isSignUp: false,
      email: '',
      password: '',
      repeatPassword: '',
      errorMessage: '',
      isEmailValid: true,
      isPasswordValid: true
    }
  },
  methods: {
    switchMode () {
      this.isSignUp = !this.isSignUp
      this.isEmailValid = this.isPasswordValid = true
      this.email = this.password = this.repeatPassword = this.errorMessage = ''
    },
    async signByGoogle () {
      this.isLoading = true
      try {
        await signInGoogle()
        this.$emit('signIn')
      } catch (err) {
        this.errorMessage = err
      }
      this.isLoading = false
    },
    async auth () {
      if (!this.checkIsValid()) {
        return
      }
      this.isLoading = true
      try {
        if (this.isSignUp) {
          await signUp({ email: this.email, password: this.password })
        } else {
          await signIn({ email: this.email, password: this.password })
        }
        this.$emit('signIn')
      } catch (err) {
        if (err.toLowerCase().includes('password')) {
          this.isPasswordValid = false
        } else {
          this.isEmailValid = false
        }
        this.errorMessage = err
      }
      this.isLoading = false
    },
    checkIsValid () {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(this.email)) {
        this.isEmailValid = false
        this.errorMessage = 'Email isn\'t valid'
        return false
      }
      if (this.password.length < 6) {
        this.isPasswordValid = false
        this.errorMessage = 'Password must be at least 6 characters long'
        return false
      }
      if (this.isSignUp && this.password !== this.repeatPassword) {
        this.isPasswordValid = false
        this.errorMessage = 'Passwords must be the same'
        return false
      }
      return true
    },
    refreshValidation () {
      this.isPasswordValid = this.isEmailValid = true
      this.errorMessage = ''
    }
  }
}
</script>

<style scoped lang="scss">
.auth-card {
  padding: 15px;
  max-width: 400px;
  margin: 10px;

  & > div {
    margin-bottom: 15px;
  }

  &-logo {
    font-size: 24px;
    font-weight: bold;
    color: $primary-color;
  }
  &-title {
    color: $secondary-color;
  }

  &-email-section {
    span {
      font-size: 12px;
    }
  }

  &-or-section {
    display: flex;
    align-items: center;

    span {
      color: $secondary-color;
      margin: 0 5px;
    }
  }

  &-to-mode {
    font-size: 14px;
  }
}

.error-card {
  position: fixed;
  padding: 10px;
  margin: 10px 0;
  background-color: lighten($danger-color, 30%);
  border: 1px solid $danger-color;
  color: $danger-color;
  font-size: 14px;
  font-weight: bold;
}
</style>
