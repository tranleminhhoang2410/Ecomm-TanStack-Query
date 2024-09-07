import { useInfiniteQuery } from '@tanstack/react-query'

// Constants
import { PAGINATION, QUERY_KEYS } from '@app/constants'

/// Types
import { CartItem, ExtendedQueryParams } from '@app/types'

// Services
import { getCartService } from '@app/services'

export const useGetCart = (params?: ExtendedQueryParams<Partial<CartItem>>) => {
  const defaultParams: ExtendedQueryParams<Partial<CartItem>> = {
    page: 1,
    _sort: 'id',
    _order: 'desc',
    limit: PAGINATION.DEFAULT_ITEMS_PER_PAGE
  }

  const { isFetching, data, ...rest } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.CART, { ...defaultParams, ...params }],
    queryFn: () => getCartService({ ...defaultParams, ...params }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined)
  })

  const lastPage = data?.pages[data?.pages?.length - 1] || {
    data: [],
    limit: 0,
    page: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    totalItems: 0,
    totalPages: 0
  }
  const cartList = data?.pages.flatMap((page) => page.data) || []
  const totalItems = Number(lastPage?.totalItems)
  const itemsPerPage = Number(lastPage?.limit)
  const currentPage = Number(lastPage?.page)

  return {
    isCartListFetching: isFetching,
    cartList,
    lastPage,
    totalItems,
    itemsPerPage,
    currentPage,
    ...rest
  }
}
