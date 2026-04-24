import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ProfileController extends Controller {
  @service auth;
  @service notifications;
  @service router;
  @service session;

  @tracked formName = '';
  @tracked formPassword = '';
  @tracked isSaving = false;
  @tracked errorMsg = '';

  @action setField(fieldName, e) { this[fieldName] = e.target.value; }

  @action async saveProfile(event) {
    event.preventDefault();
    if (this.isSaving) return;
    this.isSaving = true;
    this.errorMsg = '';

    const userId = this.auth.currentUser?.id;

    try {
      const body = {
        name: this.formName || this.model?.name,
      };

      if (this.formPassword) {
        body.password = this.formPassword;
      }

      const result = await this.auth.fetchJson(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });

      const updatedUser = result?.data ?? this.model;

      this.session.data.authenticated.user = updatedUser;
      this.session.saveToStorage();
      this.formName = updatedUser.name ?? '';
      this.formPassword = '';

      this.notifications.success('Profile updated');
      this.router.refresh('profile');
    } catch (e) {
      this.errorMsg = e.message;
    } finally {
      this.isSaving = false;
    }
  }
}
