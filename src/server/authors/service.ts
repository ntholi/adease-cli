import AuthorRepository from './repository';
import { Author } from '@/db/schema';
import withAuth from '@/utils/withAuth';

class AuthorService {
  constructor(private readonly repository: AuthorRepository) {}

  async first() {
    return withAuth(async () => this.repository.findFirst(), []);
  }

  async get(id: number) {
    return withAuth(async () => this.repository.findById(id), []);
  }

  async search(
    page: number = 1,
    search = '',
    searchProperties: (keyof typeof Author)[] = [],
    pageSize: number = 15
  ) {
    return withAuth(
      async () => this.repository.search(page, search, searchProperties, pageSize),
      []
    );
  }

  async create(data: Author) {
    return withAuth(async () => this.repository.create(data), []);
  }

  async update(id: number, data: Author) {
    return withAuth(async () => this.repository.update(id, data), []);
  }

  async delete(id: number) {
    return withAuth(async () => this.repository.delete(id), []);
  }

  async count() {
    return withAuth(async () => this.repository.count(), []);
  }
}

export default AuthorService;
