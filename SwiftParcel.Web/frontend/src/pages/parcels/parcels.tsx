import { Table, Pagination } from "flowbite-react";
import React from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getDeliveries } from "../../utils/api";
import { Loader } from "../../components/loader";
import { ParcelDetails } from "../../components/details/parcel";

export default function Parcels() {
  const [page, setPage] = React.useState(1);
  const [parcels, setParcels] = React.useState<any>(null);

  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingParcels, setLoadingParcels] = React.useState(true);

  React.useEffect(() => {
    getDeliveries(page)
      .then((res) => {
        if (res.status === 200) {
          setParcels(res?.data);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        setParcels(null);
      })
      .finally(() => {
        setLoadingParcels(false);
      });
  }, [page]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <>
      {loadingHeader || loadingParcels ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loadingHeader} setLoading={setLoadingHeader} />
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Parcels
        </h1>
        <Table>
          <Table.Head>
            <Table.HeadCell>#</Table.HeadCell>
            <Table.HeadCell>Sender</Table.HeadCell>
            <Table.HeadCell>Receiver</Table.HeadCell>
            <Table.HeadCell>Weight</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Deliver</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {parcels != null && parcels?.results?.length > 0 ? (
              parcels?.results.map((parcel: any) => (
                <ParcelDetails
                  key={parcel.parcelNumber}
                  parcelData={parcel}
                  showDeliverBtn={true}
                  toggleRender={false}
                  setToggleRender={function (toggleRender: boolean): void {
                    throw new Error("Function not implemented.");
                  }}
                  showEditDeleteBtn={undefined}
                  showCourier={undefined}
                  showAssignBtn={undefined}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No parcels found
                </td>
              </tr>
            )}
          </Table.Body>
        </Table>
        {parcels != null && parcels?.total_pages > 1 ? (
          <Pagination
            currentPage={page}
            onPageChange={onPageChange}
            showIcons={true}
            totalPages={parcels?.total_pages || 1}
          />
        ) : null}
        <Footer />
      </div>
    </>
  );
}
