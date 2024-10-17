import { Table, Pagination, Button } from "flowbite-react";
import React from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getOrdersUser } from "../../utils/api";
import { Loader } from "../../components/loader";
import { OrderDetails } from "../../components/details/order";
import { FilterOrdersModal } from "../../components/modals/orders/filterOrdersModal";
import { getUserIdFromStorage } from "../../utils/storage";
import { AddOrderByIdModal } from "../../components/modals/orders/addOrderByIdModal";

export default function Orders() {
  const [page, setPage] = React.useState(1);
  const [inputData, setInputData] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any>(null);

  const [sortedColumn, setSortedColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('ascending');

  const [showAddOrderByIdModal, setShowAddOrderByIdModal] = React.useState(false);
  const [showFilterOrdersModal, setShowFilterOrdersModal] = React.useState(false);

  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingOfferRequests, setLoadingOfferRequests] = React.useState(true);

  React.useEffect(() => {

    getOrdersUser(getUserIdFromStorage())
        .then((res) => {
            if (res.status === 200) {
                setInputData(res?.data);
                setTableData(res?.data);
            } else {
                throw new Error();
            }
        })
        .catch((err) => {
            setInputData(null);
            setTableData(null);
        })
        .finally(() => {
            setLoadingOfferRequests(false);
        });

  }, [page]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const handleSort = (column : string) => {
    let direction = 'ascending';
    if (sortedColumn === column && sortDirection === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...tableData].sort((a, b) => {
      switch (column) {
        case 'id': {
            const idA = a.id;
            const idB = b.id;
            if (direction === 'ascending') {
                return idA > idB ? 1 : -1;
            }
            else {
                return idA < idB ? 1 : -1;
            }
        }
        case 'sourceAddress': {
          const addressA = `${a.parcel.source.street} ${a.parcel.source.buildingNumber} ${a.parcel.source.apartmentNumber}
            ${a.parcel.source.zipCode} ${a.parcel.source.city} ${a.parcel.source.country}`;
          const addressB = `${b.parcel.source.street} ${b.parcel.source.buildingNumber} ${b.parcel.source.apartmentNumber}
            ${b.parcel.source.zipCode} ${b.parcel.source.city} ${b.parcel.source.country}`;
          if (direction === 'ascending') {
            return addressA > addressB ? 1 : -1;
          }
          else {
            return addressA < addressB ? 1 : -1;
          }
        }
        case 'destinationAddress': {
          const addressA = `${a.parcel.destination.street} ${a.parcel.destination.buildingNumber} ${a.parcel.destination.apartmentNumber}
            ${a.parcel.destination.zipCode} ${a.parcel.destination.city} ${a.parcel.destination.country}`;
          const addressB = `${b.parcel.destination.street} ${b.parcel.destination.buildingNumber} ${b.parcel.destination.apartmentNumber}
            ${b.parcel.destination.zipCode} ${b.parcel.destination.city} ${b.parcel.destination.country}`;
          if (direction === 'ascending') {
            return addressA > addressB ? 1 : -1;
          }
          else {
            return addressA < addressB ? 1 : -1;
          }
        }
        case 'company': {
          const idA = a.company;
          const idB = b.company;
          if (direction === 'ascending') {
              return idA > idB ? 1 : -1;
          }
          else {
              return idA < idB ? 1 : -1;
          }
        }
        case 'orderRequestDate': {
          const dateA = new Date(a.orderRequestDate);
          const dateB = new Date(b.orderRequestDate);
          if (direction === 'ascending') {
            return dateA > dateB ? 1 : -1;
          }
          else {
            return dateA < dateB ? 1 : -1;
          }
        }
        case 'requestValidTo': {
            const dateA = new Date(a.requestValidTo);
            const dateB = new Date(b.requestValidTo);
            if (direction === 'ascending') {
              return dateA > dateB ? 1 : -1;
            }
            else {
              return dateA < dateB ? 1 : -1;
            }
        }
        case 'status': {
          const idA = a.status;
          const idB = b.status;
          if (direction === 'ascending') {
              return idA > idB ? 1 : -1;
          }
          else {
              return idA < idB ? 1 : -1;
          }
        }
        default:
          return 0;
      }
    });

    setSortedColumn(column);
    setSortDirection(direction);
    setTableData(sortedData);
  };

  const getSortIcon = (column : string) => {
    return sortedColumn === column ? (sortDirection === 'ascending' ? '▲' : '▼') : '';
  }

  const tableHeaderStyle = {
    row: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    left: {
      alignSelf: 'flex-start',
    },
    right: {
      alignSelf: 'flex-end',
    },
  };

  return (
    <>
      {loadingHeader || loadingOfferRequests ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loadingHeader} setLoading={setLoadingHeader} />
        <div style={tableHeaderStyle.row}>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white" style={tableHeaderStyle.left}>
          Your orders
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button className="mr-2" onClick={() => setShowAddOrderByIdModal(true)}>
              <span className="hidden sm:flex">Add order by id</span>
            </Button>
            <Button className="mr-2" onClick={() => setShowFilterOrdersModal(true)}>
              <span className="hidden sm:flex">Filter data</span>
            </Button>
          </div>
        </div>
        <p className="mb-5">
          To see details of an order or check its full status, click button in the last column of the table.
        </p>
        <AddOrderByIdModal
          show={showAddOrderByIdModal}
          setShow={setShowAddOrderByIdModal}
        />
        <FilterOrdersModal
          show={showFilterOrdersModal}
          setShow={setShowFilterOrdersModal}
          inputData={inputData}
          tableData={tableData}
          setTableData={setTableData}
        />
        <Table>
          <Table.Head>
            <Table.HeadCell onClick={() => handleSort('id')}>
              Order Id {getSortIcon('id')}
            </Table.HeadCell>
            <Table.HeadCell>
              Inquiry
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('sourceAddress')}>
              Source address {getSortIcon('sourceAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('destinationAddress')}>
              Destination address {getSortIcon('destinationAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('company')}>
              Company {getSortIcon('company')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('orderRequestDate')}>
              Order request date {getSortIcon('orderRequestDate')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('status')}>
              Status {getSortIcon('status')}
            </Table.HeadCell>
            <Table.HeadCell>
              Details
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData != null && tableData?.length > 0 ? (
              tableData?.map((order: any) => (
                <OrderDetails
                  key={order.id}
                  orderData={order}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </Table.Body>
        </Table>
        {tableData != null && tableData?.total_pages > 1 ? (
          <Pagination
            currentPage={page}
            onPageChange={onPageChange}
            showIcons={true}
            totalPages={tableData?.total_pages || 1}
          />
        ) : null}
        <Footer />
      </div>
    </>
  );
}
