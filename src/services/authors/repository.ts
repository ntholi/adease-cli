import BaseRepository from '@/lib/repository/BaseRepository
import {authors} from '@/db/schema'

export default class AuthorRepository extends BaseRepository<
  typeof authors,
  'id'
> {
  constructor() {
    super(authors, 'id');
  }
}

export const authorsRepository = new AuthorRepository();
