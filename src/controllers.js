const products = [
  {
    id: 1,
    descricao: 'Coca cola 2lts',
    valor: 10.00,
    qtde: 10
  },
  {
    id: 2,
    descricao: "Cerveja",
    valor: 5.80,
    qtde: 50
  },
  {
    id: 3,
    descricao: 'Agua',
    valor: 2.00,
    qtde: 5
  }
]

const userCart = []

module.exports = {
  async createCart(request, response) {

    const { id, descricao, valor, qtde } = request.body

    const existsProduct = products.find(product => product.id === id)
    if (existsProduct) {
      return response.status(400).json({
        error: 'Produto já cadastrado'
      })
    }

    const existsDescription = products.find(product => product.descricao.toLocaleLowerCase() === descricao.toLocaleLowerCase())
    if (existsDescription) {
      return response.status(400).json({
        error: 'Produto já cadastrado'
      })
    }

    const product = {
      id,
      descricao,
      valor,
      qtde
    }

    //Adicionar um novo elemento no array, usamos o push
    products.push(product)

    return response.json({ data: product })
  },

  async getListOfCart(request, response) {
    return response.json({ data: products })
  },

  async createUserCart(request, response) {

    const { item } = request.body

    for (const product of item) {
      const productExists = products.find(prd => prd.id === product.id)

      //Verifica se existe o produto
      if (!productExists) {
        return response.status(400).json({
          error: 'Produto não encontrado'
        })
      }

      //Verifica se possui estoque
      if (product.qtde > productExists.qtde) {
        return response.status(400).json({
          error: 'Quantidade não disponivel'
        })
      }

      const userItems = {
        productId: productExists.id,
        descricao: productExists.descricao,
        qtde: product.qtde,
        valor: product.qtde * productExists.valor
      }

      userCart.push(userItems)

      //Diminui a quantidade em estoque
      const index = products.findIndex(idx => idx.id === product.id)
      products[index].qtde = products[index].qtde - product.qtde
      //products[index].qtde -= product.qtde -> decremento
      //products[index].qtde += product.qtde -> incremento
    }

    return response.json({
      order: userCart,
      stock: products
    })

    /* products.forEach((product, index) => {
      console.log(product)
    }) */

    /* products.map((product, index) => {
      console.log(index)
    }) */
  }
}