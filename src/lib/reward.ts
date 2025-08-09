import confetti from 'canvas-confetti'

export function burstGood(){
  confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } })
}

export function tinyPop(){
  confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 }, scalar: 0.7 })
}
