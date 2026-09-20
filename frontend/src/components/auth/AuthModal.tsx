import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { UserCheck, Key, Shield, Copy, Check, Lock, User, Mail } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../context/authStore';
import { useLanguageStore } from '../../context/languageStore';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    closeAuthModal,
    authModalView,
    openAuthModal,
    login,
    register,
    createAnonymous,
    googleLogin,
    generatedCredentials,
  } = useAuthStore();

  const { t, language } = useLanguageStore();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ usernameOrEmail, password });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({
        username: usernameOrEmail,
        displayName: displayName || usernameOrEmail,
        email: email || undefined,
        password,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'bn' ? 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে' : 'Account creation failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousClick = async () => {
    setLoading(true);
    setError('');
    try {
      await createAnonymous();
    } catch (err: any) {
      setError(language === 'bn' ? 'বেনামী অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি' : 'Could not create anonymous account');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'user' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'user') {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={showAuthModal}
      onClose={closeAuthModal}
      title={
        authModalView === 'anonymousSuccess'
          ? t('authTitleAnonSuccess')
          : authModalView === 'register'
          ? t('authTitleRegister')
          : t('authTitleLogin')
      }
      subtitle={
        authModalView === 'anonymousSuccess'
          ? t('authSubAnonSuccess')
          : t('authSubLogin')
      }
      maxWidth="md"
    >
      {authModalView === 'anonymousSuccess' && generatedCredentials ? (
        <div className="space-y-5">
          <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#E3E2E3] space-y-4">
            <div>
              <label className="text-xs text-[#55555C] font-medium block mb-1">
                {t('username')}
              </label>
              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E3E2E3]">
                <span className="text-sm font-semibold text-[#191923]">
                  {generatedCredentials.username}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedCredentials.username, 'user')}
                  className="text-xs text-[#55555C] hover:text-[#191923] flex items-center gap-1 bg-[#F0EFF0] px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {copiedUser ? <Check className="w-3.5 h-3.5 text-[#168A55]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUser ? t('copied') : t('copy')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#55555C] font-medium block mb-1">
                {t('password')}
              </label>
              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E3E2E3]">
                <span className="text-sm font-semibold text-[#191923] font-mono">
                  {generatedCredentials.password}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedCredentials.password, 'pass')}
                  className="text-xs text-[#55555C] hover:text-[#191923] flex items-center gap-1 bg-[#F0EFF0] px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5 text-[#168A55]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPass ? t('copied') : t('copy')}</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#848389] leading-relaxed">
            {t('anonSaveNote')}
          </p>

          <Button
            onClick={closeAuthModal}
            variant="primary"
            size="lg"
            className="w-full rounded-xl"
          >
            {t('continueBtn')}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {error && (
            <div className="p-3 bg-[#FDEEEE] border border-[#F5D2D0] rounded-xl text-xs text-[#D94A45]">
              {error}
            </div>
          )}

          {/* Quick Anonymous Account Option */}
          <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E3E2E3] text-center">
            <div className="flex items-center justify-center gap-2 mb-1.5 text-sm font-semibold text-[#191923]">
              <Shield className="w-4 h-4 text-[#168A55]" />
              <span>{t('anonNoInfoNeeded')}</span>
            </div>
            <p className="text-xs text-[#55555C] mb-3">
              {t('anonDesc')}
            </p>
            <Button
              onClick={handleAnonymousClick}
              variant="secondary"
              size="md"
              loading={loading}
              className="w-full rounded-xl font-semibold border-[#191923]/20"
            >
              {t('anonBtn')}
            </Button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#EFEDEF]"></div>
            <span className="flex-shrink mx-3 text-xs text-[#848389]">{t('or')}</span>
            <div className="flex-grow border-t border-[#EFEDEF]"></div>
          </div>

          {/* Google OAuth Login Button */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  googleLogin(credentialResponse.credential);
                }
              }}
              onError={() => setError(language === 'bn' ? 'গুগল লগইন ব্যর্থ হয়েছে' : 'Google login failed')}
              useOneTap
              theme="outline"
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#EFEDEF]"></div>
            <span className="flex-shrink mx-3 text-xs text-[#848389]">{t('orWithUsername')}</span>
            <div className="flex-grow border-t border-[#EFEDEF]"></div>
          </div>

          {/* Traditional Login / Register Form */}
          <form
            onSubmit={authModalView === 'register' ? handleRegisterSubmit : handleLoginSubmit}
            className="space-y-3"
          >
            {authModalView === 'register' && (
              <Input
                label={t('displayName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('displayNamePlaceholder')}
                icon={<User className="w-4 h-4" />}
                required
              />
            )}

            <Input
              label={authModalView === 'register' ? t('username') : t('usernameOrEmail')}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder={t('usernamePlaceholder')}
              icon={<User className="w-4 h-4" />}
              required
            />

            {authModalView === 'register' && (
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                icon={<Mail className="w-4 h-4" />}
              />
            )}

            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full rounded-xl mt-2"
            >
              {authModalView === 'register' ? t('registerBtn') : t('loginBtn')}
            </Button>
          </form>

          {/* Switch between Login and Register */}
          <div className="text-center pt-2">
            {authModalView === 'register' ? (
              <p className="text-xs text-[#55555C]">
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-[#191923] font-semibold hover:underline cursor-pointer"
                >
                  {t('loginBtn')}
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#55555C]">
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-[#191923] font-semibold hover:underline cursor-pointer"
                >
                  {t('registerBtn')}
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

