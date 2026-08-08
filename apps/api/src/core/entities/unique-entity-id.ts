import { v7 as uuidv7 } from 'uuid'

export class UniqueEntityId {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? uuidv7()
  }

  equals(id: UniqueEntityId) {
    return id.toValue() === this.toValue()
  }
}
