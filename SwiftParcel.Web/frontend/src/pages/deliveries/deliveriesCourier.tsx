import { Table, Pagination, Button } from "flowbite-react";
import React from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getYourDeliveries, getPendingDeliveries } from "../../utils/api";
import { Loader } from "../../components/loader";
import { DeliveryDetails } from "../../components/details/delivery";
import { FilterDeliveriesModal } from "../../components/modals/deliveries/filterDeliveriesModal";
import { getUserIdFromStorage } from "../../utils/storage";
import booleanToString from "../../components/parsing/booleanToString";

export default function DeliveriesCourier(pageContent: string) {
  const [page, setPage] = React.useState(1);
  const [inputData, setInputData] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any>(null);

  const [sortedColumn, setSortedColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('ascending');

  const [showFilterDeliveriesModal, setShowFilterDeliveriesModal] = React.useState(false);

  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingDeliveries, setLoadingDeliveries] = React.useState(true);

  React.useEffect(() => {

    ((pageContent == "your-deliveries") ? getYourDeliveries(getUserIdFromStorage()) : getPendingDeliveries())
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
            setLoadingDeliveries(false);
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
            const addressA = `${a.source.street} ${a.source.buildingNumber} ${a.source.apartmentNumber}
              ${a.source.zipCode} ${a.source.city} ${a.source.country}`;
            const addressB = `${b.source.street} ${b.source.buildingNumber} ${b.source.apartmentNumber}
              ${b.source.zipCode} ${b.source.city} ${b.source.country}`;
            if (direction === 'ascending') {
              return addressA > addressB ? 1 : -1;
            }
            else {
              return addressA < addressB ? 1 : -1;
            }
        }
        case 'destinationAddress': {
            const addressA = `${a.destination.street} ${a.destination.buildingNumber} ${a.destination.apartmentNumber}
              ${a.destination.zipCode} ${a.destination.city} ${a.destination.country}`;
            const addressB = `${b.destination.street} ${b.destination.buildingNumber} ${b.destination.apartmentNumber}
              ${b.destination.zipCode} ${b.destination.city} ${b.destination.country}`;
            if (direction === 'ascending') {
              return addressA > addressB ? 1 : -1;
            }
            else {
              return addressA < addressB ? 1 : -1;
            }
        }
        case 'pickupDate': {
            const dateA = new Date(a.pickupDate);
            const dateB = new Date(b.pickupDate);
            if (direction === 'ascending') {
              return dateA > dateB ? 1 : -1;
            }
            else {
              return dateA < dateB ? 1 : -1;
            }
        }
        case 'deliveryDate': {
            const dateA = new Date(a.deliveryDate);
            const dateB = new Date(b.deliveryDate);
            if (direction === 'ascending') {
                return dateA > dateB ? 1 : -1;
            }
            else {
                return dateA < dateB ? 1 : -1;
            }
        }
        case 'priority': {
            const idA = a.priority;
            const idB = b.priority;
            if (direction === 'ascending') {
                return idA > idB ? 1 : -1;
            }
            else {
                return idA < idB ? 1 : -1;
            }
        }
        case 'atWeekend': {
            const idA = booleanToString(a.atWeekend);
            const idB = booleanToString(b.atWeekend);
            if (direction === 'ascending') {
                return idA > idB ? 1 : -1;
            }
            else {
                return idA < idB ? 1 : -1;
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
        case 'lastUpdate': {
            const dateA = new Date(a.lastUpdate);
            const dateB = new Date(b.lastUpdate);
            if (direction === 'ascending') {
                return dateA > dateB ? 1 : -1;
            }
            else {
                return dateA < dateB ? 1 : -1;
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
      {loadingHeader || loadingDeliveries ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loadingHeader} setLoading={setLoadingHeader} />
        <div style={tableHeaderStyle.row}>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white" style={tableHeaderStyle.left}>
            {pageContent == "your-deliveries" ? 'Your deliveries' : 'Pending deliveries'}
          </h1>

          <Button className="mr-2" onClick={() => setShowFilterDeliveriesModal(true)}>
            <span className="hidden sm:flex">Filter data</span>
          </Button>
        </div>
        { pageContent == "your-deliveries" ? (
            <p className="mb-5">
              To set a delivery as delivered or cannot deliver, open details by clicking button in the last column.
            </p>
          ) :
            <p className="mb-5">
              To set a delivery as picked up, open details by clicking button in the last column.
            </p>
          }
        <FilterDeliveriesModal
          show={showFilterDeliveriesModal}
          setShow={setShowFilterDeliveriesModal}
          inputData={inputData}
          tableData={tableData}
          setTableData={setTableData}
          pageContent={pageContent}
        />
        <Table>
          <Table.Head>
            <Table.HeadCell onClick={() => handleSort('id')}>
              Id {getSortIcon('id')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('sourceAddress')}>
              Source address {getSortIcon('sourceAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('destinationAddress')}>
              Destination address {getSortIcon('destinationAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('pickupDate')}>
              Pickup date {getSortIcon('pickupDate')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('deliveryDate')}>
              Delivery date {getSortIcon('deliveryDate')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('priority')}>
              Priority {getSortIcon('priority')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('atWeekend')}>
              At weekend {getSortIcon('atWeekend')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('status')}>
              Status {getSortIcon('status')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('lastUpdate')}>
              Last update {getSortIcon('lastUpdate')}
            </Table.HeadCell>
            <Table.HeadCell>
              Details
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData != null && tableData?.length > 0 ? (
              tableData?.map((delivery: any) => (
                <DeliveryDetails
                  key={delivery.id}
                  deliveryData={delivery}
                  pageContent={pageContent}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center">
                  No {pageContent == "your-deliveries" ? 'your deliveries' : 'pending deliveries'} found
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
