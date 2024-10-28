import Answers from '../types/Answers';

export abstract class BaseGenerator {
  constructor(protected readonly answers: Answers) {}
  abstract generate(): Promise<void>;
}
