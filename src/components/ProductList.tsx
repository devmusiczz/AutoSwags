import Link from 'next/link';
import Image from 'next/image';
import { wixClientServer } from '@/lib/wixClientServer';
import { products } from "@wix/stores";
import DOMPurify from "isomorphic-dompurify";

const PRODUCT_PER_PAGE = 20;

const ProductList = async ({
    categoryId,
    limit,
}:{
    categoryId:string;
    limit?:number;
}) => {

    const wixClient = await wixClientServer();
  
    const res = await wixClient.products
    .queryProducts()
    .eq("collectionIds", categoryId)
    .limit(limit || PRODUCT_PER_PAGE)
    .find();


  return (
      <div className="flex gap-x-8 gap-y-16 mt-12 justify-between flex-wrap">
          {res.items.map((product: products.Product) => (
              
              <Link
              href={"/"+product.slug}
              className='w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]'
              key={product._id}
              >
        <div className='relative w-full h-80'>
            <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt=""
                fill sizes='25vw'
                className='absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500'
                
            />
             {product.media?.items &&(<Image
             src={product.media?.items[1]?.image?.url || "/product.png"}
             alt=""
             fill
             sizes='25vw'
             className='absolute object-cover rounded-md'
             />)}
        </div>
        <div className='flex justify-between' >
            <span className='font-medium'>{product.name}</span>
            <span className='font-semibold'>Rs {product.price?.price}</span>
        </div>
        {product.additionalInfoSections && (
        <div
            className='text-sm text-gray-500'
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                    product.additionalInfoSections.find(
                        (section:any) => section.title === "shortDescp"
                    )?.description || ""
                ),
            }}>
        </div>
            )}
        <button className='rounded-2xl ring-1 w-max ring-laalhai text-laalhai py-2 px-4 text-xs hover:bg-laalhai hover:text-white' >
            Add to Cart
        </button>
    </Link>
))}
    </div>
  );
};

export default ProductList