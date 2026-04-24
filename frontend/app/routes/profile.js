import AuthenticatedRoute from './authenticated';
import { service } from '@ember/service';

export default class ProfileRoute extends AuthenticatedRoute {
  @service auth;

  async model() {
    const currentUser = this.auth.currentUser;
    const userId = currentUser?.id;
    if (!userId) return null;

    try {
      const json = await this.auth.fetchJson(`/users/${userId}`);
      return json.data ?? currentUser ?? null;
    } catch {
      return currentUser ?? null;
    }
  }
}
