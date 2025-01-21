import * as sim from './simulator';
import {platSogo} from '../platforms/sogo'



describe('search map', () => {
    it('common', () => {
        const testMb = platSogo.load(`
            甲\ta
            乙\tb
            甲乙\tc`) 
        expect(sim.createSearchMap(testMb)).toMatchSnapshot()
    })
    it('duplicated code', () => {
        const testMb = platSogo.load(`
            甲\taa
            甲\ta`) 
        expect(sim.createSearchMap(testMb)).toMatchSnapshot()
    })
})

describe('search regex', () => {

    it('eager order', () => {
        const testMb = platSogo.load(`甲\taa\n甲乙\ta`) 
        expect(sim.createSearchRegexPattern(testMb)).toMatchSnapshot()
    })
    it('mb order', () => {
        const testMb = platSogo.load(`甲\taa\n甲乙\ta`) 
        expect(sim.createSearchRegexPattern(testMb,true)).toMatchSnapshot()
    })
})

describe('simurate', () => {
    it('common', () => {
        expect(search(`a 甲\nb 乙\nc 甲乙\n`,'甲乙')).toMatchSnapshot()
    })
})


function search(src,article) {
    const mb = platSogo.load(src) 
    const map = sim.createSearchMap(mb) 
    const re = sim.createSearchRegexPattern(mb)
  
    const gen =  sim.simurate(mb,re,map,article)
    
    while(true) {
      const {value,done} = gen.next()
      if(done) return value
    }  
  }