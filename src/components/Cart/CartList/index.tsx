import { Fragment } from 'react'
import {
  Box,
  Divider,
  Heading,
  HStack,
  IconButton,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'

// Constants
import { PAGINATION } from '@app/constants'

// Types
import { Cart } from '@app/types'

// Components
import { CloseIcon, ProductListEmpty, SkeletonCartItem, CartItem, QuantityController } from '@app/components'

// Utils
import { calculateProductPrice } from '@app/utils'

interface ICartListProps {
  isFetching: boolean
  carts: Cart[]
  onRemoveItemFromCart: (cartId: number) => void
  onIncreaseQuantity: (cartId: number) => void
  onDecreaseQuantity: (cartId: number) => void
  onChangeQuantity: (cartId: number, value: number) => void
}

const CartList = ({
  isFetching,
  carts,
  onRemoveItemFromCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onChangeQuantity
}: ICartListProps) => {
  const renderCartContent = () => {
    if (isFetching) {
      return Array.from({ length: PAGINATION.DEFAULT_ITEMS_PER_PAGE }).map((_, index) => (
        <Fragment key={index}>
          <SkeletonCartItem />
          {index < PAGINATION.DEFAULT_ITEMS_PER_PAGE - 1 && <Divider orientation="horizontal" />}
        </Fragment>
      ))
    }

    if (!carts.length) {
      return <ProductListEmpty />
    }

    return carts.map((cart, index) => (
      <Fragment key={cart.id}>
        <CartItem
          cart={cart}
          onRemoveItemFromCart={onRemoveItemFromCart}
          onIncreaseQuantity={() => onIncreaseQuantity(cart.id)}
          onChangeQuantity={(value) => onChangeQuantity(cart.id, Number(value))}
          onDecreaseQuantity={() => onDecreaseQuantity(cart.id)}
        />
        {index < carts.length - 1 && <Divider orientation="horizontal" />}
      </Fragment>
    ))
  }

  return (
    <>
      {/* Cart for Mobile & Tablet screen */}
      <Stack display={{ base: 'flex', lg: 'none' }} gap={8}>
        {renderCartContent()}
      </Stack>
      {/* Table for Desktop screen */}
      <TableContainer display={{ base: 'none', lg: 'block' }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Product</Th>
              <Th>Unit Price</Th>
              <Th>Qty</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {carts.map((cart) => {
              const {
                id,
                productName,
                productImage,
                productPrice,
                productUnitPrice,
                productQuantity,
                productDiscount,
                quantity
              } = cart

              return (
                <Tr key={id}>
                  <Td>
                    <IconButton
                      boxSize={4}
                      minW="unset"
                      aria-label="close"
                      backgroundColor="backgroundBlurGray"
                      icon={<CloseIcon boxSize={2} color="textLightRed" />}
                      _hover={{ opacity: 0.6 }}
                      onClick={() => onRemoveItemFromCart(id)}
                    />
                  </Td>
                  <Td>
                    <HStack>
                      <Box boxSize="80px">
                        <Image src={productImage} boxSize="full" objectFit="cover" />
                      </Box>

                      <Heading as="h3" fontSize="textSmall" noOfLines={1}>
                        {productName}
                      </Heading>
                    </HStack>
                  </Td>
                  <Td>
                    <Text>
                      {productUnitPrice}
                      {calculateProductPrice(productPrice, productDiscount)}
                    </Text>
                  </Td>
                  <Td>
                    <QuantityController
                      maxQuantity={productQuantity}
                      currentQuantity={quantity}
                      onIncreaseQuantity={() => onIncreaseQuantity(id)}
                      onChangeQuantity={(value) => onChangeQuantity(id, Number(value))}
                      onDecreaseQuantity={() => onDecreaseQuantity(id)}
                      size="md"
                    />
                  </Td>
                  <Td>
                    <Text>
                      {productUnitPrice}
                      {calculateProductPrice(productPrice, productDiscount, quantity)}
                    </Text>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CartList
