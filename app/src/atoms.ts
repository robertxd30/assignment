import { atom } from 'jotai'
import { UserInterface } from './Interfaces/UserInterface'

export const userAtom = atom<UserInterface[]>([])