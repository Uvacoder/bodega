import { supabase } from '@/supabase'

const getCellarBottles = async () => {
  return await supabase
    .from('bottles')
    .select()
    .is('mycellar', true)
    .gt('qty', 0)
    .order('last_added', { ascending: false })
}
const getBottles = async () => {
  return await supabase
    .from('bottles')
    .select()
    .order('last_added', { ascending: false })
}
const addBottle = async (
  name: string,
  cellar: string,
  vintage: number,
  country: string,
  region: string,
  apellation: string,
  type: string,
  qty: number,
  date?: any,
  mycellar?: boolean,
  reviewed?: boolean
) => {
  let res = await supabase.from('bottles').insert([
    {
      name: name,
      cellar: cellar,
      vintage: vintage,
      country: country,
      region: region,
      apellation: apellation,
      type: type,
      qty: qty,
      last_added: date ? date : new Date(),
      mycellar: mycellar ? mycellar : false,
      reviewed: reviewed ? reviewed : false,
    },
  ])
  for (let i = 0; i < qty; i++) {
    await supabase.from('added_bottles').insert([
      {
        bottle_id: res.data![0].id,
        date_added: new Date(),
      },
    ])
  }
}
const updateBottle = async (
  name: string,
  cellar: string,
  vintage: number,
  country: string,
  region: string,
  apellation: string,
  type: string,
  qty: number,
  id: number,
  date?: any
) => {
  try {
    await supabase
      .from('bottles')
      .update([
        {
          name: name,
          cellar: cellar,
          vintage: vintage,
          country: country,
          region: region,
          apellation: apellation,
          type: type,
          qty: qty,
          last_added: date,
        },
      ])
      .eq('id', id)
  } catch (error: any) {
    alert(error.message)
  }
}
const updateBottleMetadata = async (id: number, updatedData: {}) => {
  try {
    await supabase
      .from('bottles')
      .update([
        {
          date_scrapped: new Date(),
          ...updatedData,
        },
      ])
      .eq('id', id)
  } catch (error: any) {
    alert(error.message)
  }
}
const removeBottle = async (id: string) => {
  try {
    await supabase.from('bottles').update({ qty: 0 }).eq('id', id)
  } catch (error: any) {
    alert(error.message)
  }
}
const increaseBottleQty = async (id: number, qty: number) => {
  try {
    await supabase
      .from('bottles')
      .update({ qty: qty + 1, last_added: new Date() })
      .eq('id', id)
    await supabase.from('added_bottles').insert([
      {
        bottle_id: id,
        date_added: new Date(),
      },
    ])
  } catch (error: any) {
    alert(error.message)
  }
}
const decreaseBottleQty = async (id: number, qty: number) => {
  try {
    await supabase
      .from('bottles')
      .update({ qty: qty ? qty - 1 : 0 })
      .eq('id', id)
    await supabase.from('opened_bottles').insert([
      {
        bottle_id: id,
        date_opened: new Date(),
      },
    ])
  } catch (error: any) {
    alert(error.message)
  }
}
const getOpenedBottles = async () => {
  return await supabase
    .from('opened_bottles')
    .select()
    .order('date_opened', { ascending: true })
}
const getAddedBottles = async () => {
  return await supabase
    .from('added_bottles')
    .select()
    .order('date_added', { ascending: true })
}

export {
  getCellarBottles,
  getBottles,
  addBottle,
  updateBottle,
  updateBottleMetadata,
  removeBottle,
  increaseBottleQty,
  decreaseBottleQty,
  getOpenedBottles,
  getAddedBottles,
}
