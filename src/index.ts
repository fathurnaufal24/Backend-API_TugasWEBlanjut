import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

let products: Product[] = [
  { id: 1, name: 'Laptop Gaming', price: 15000000, category: 'Elektronik' },
  { id: 2, name: 'Mouse Wireless', price: 250000, category: 'Aksesori' }
]

const app = new Elysia()
  .use(cors())
  // READ ALL
  .get('/api/products', () => products)
  // CREATE
  .post(
    '/api/products',
    ({ body }) => {
      const newProduct: Product = {
        id: Date.now(),
        ...body
      }
      products.push(newProduct)
      return newProduct
    },
    {
      body: t.Object({
        name: t.String(),
        price: t.Number(),
        category: t.String()
      })
    }
  )
  // UPDATE
  .put(
    '/api/products/:id',
    ({ params: { id }, body, set }) => {
      const index = products.findIndex((p) => p.id === Number(id))
      if (index === -1) {
        set.status = 404
        return { message: 'Produk tidak ditemukan' }
      }
      products[index] = { ...products[index], ...body }
      return products[index]
    },
    {
      body: t.Object({
        name: t.String(),
        price: t.Number(),
        category: t.String()
      })
    }
  )
  // DELETE
  .delete('/api/products/:id', ({ params: { id }, set }) => {
    const index = products.findIndex((p) => p.id === Number(id))
    if (index === -1) {
      set.status = 404
      return { message: 'Produk tidak ditemukan' }
    }
    products = products.filter((p) => p.id !== Number(id))
    return { message: 'Produk berhasil dihapus' }
  })
  .listen(3000)

console.log(`Backend API berjalan di http://${app.server?.hostname}:${app.server?.port}`)