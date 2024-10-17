import { Table, Pagination, Button } from "flowbite-react";
import React from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getOfferRequests, getPendingOffers } from "../../utils/api";
import { Loader } from "../../components/loader";
import { OfferRequestDetails } from "../../components/details/offerRequest";
import { FilterOfferRequestsModal } from "../../components/modals/offers/filterOfferRequestsModal";

export default function OffersOfficeWorker(pageContent: string) {
  const [page, setPage] = React.useState(1);
  const [inputData, setInputData] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any>(null);

  const [sortedColumn, setSortedColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('ascending');

  const [showFilterOfferRequestsModal, setShowFilterOfferRequestsModal] = React.useState(false);

  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingOfferRequests, setLoadingOfferRequests] = React.useState(true);

  React.useEffect(() => {

    ((pageContent == "offer-requests") ? getOfferRequests() : getPendingOffers())
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
        case 'customerId': {
            const idA = a.customerId;
            const idB = b.customerId;
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
        case 'buyerName': {
            const idA = a.buyerName;
            const idB = b.buyerName;
            if (direction === 'ascending') {
                return idA > idB ? 1 : -1;
            }
            else {
                return idA < idB ? 1 : -1;
            }
        }
        case 'buyerEmail': {
            const idA = a.buyerEmail;
            const idB = b.buyerEmail;
            if (direction === 'ascending') {
                return idA > idB ? 1 : -1;
            }
            else {
                return idA < idB ? 1 : -1;
            }
        }
        case 'buyerAddress': {
          const addressA = `${a.buyerAddress.street} ${a.buyerAddress.buildingNumber} ${a.buyerAddress.apartmentNumber}
            ${a.buyerAddress.zipCode} ${a.buyerAddress.city} ${a.buyerAddress.country}`;
          const addressB = `${b.buyerAddress.street} ${b.buyerAddress.buildingNumber} ${b.buyerAddress.apartmentNumber}
            ${b.buyerAddress.zipCode} ${b.buyerAddress.city} ${b.buyerAddress.country}`;
          if (direction === 'ascending') {
            return addressA > addressB ? 1 : -1;
          }
          else {
            return addressA < addressB ? 1 : -1;
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
            {pageContent == "offer-requests" ? 'Bank offer requests' : 'Manage pending offers'}
          </h1>

          <Button className="mr-2" onClick={() => setShowFilterOfferRequestsModal(true)}>
            <span className="hidden sm:flex">Filter data</span>
          </Button>
        </div>
        { pageContent == "pending-offers" ?
            <p className="mb-5">
              To accept of reject an offer request, open details by clicking button in the last column, then scroll down.
            </p>
          :
            <p className="mb-5">
              To see details of an offer request or check its full status, click button in the last column of the table.
            </p>
        }
        <FilterOfferRequestsModal
          show={showFilterOfferRequestsModal}
          setShow={setShowFilterOfferRequestsModal}
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
            <Table.HeadCell>
              Inquiry
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('status')}>
              Status {getSortIcon('status')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('orderRequestDate')}>
              Order request date {getSortIcon('orderRequestDate')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('requestValidTo')}>
              Request valid to date {getSortIcon('requestValidTo')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('buyerName')}>
              Buyer name {getSortIcon('buyerName')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('buyerEmail')}>
              Buyer email {getSortIcon('buyerEmail')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('buyerAddress')}>
              Buyer address {getSortIcon('buyerAddress')}
            </Table.HeadCell>
            <Table.HeadCell>
              Details
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tableData != null && tableData?.length > 0 ? (
              tableData?.map((offerDetails: any) => (
                <OfferRequestDetails
                  key={offerDetails.id}
                  offerRequestData={offerDetails}
                  pageContent={pageContent}
                />
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center">
                  No {pageContent == "offer-requests" ? 'offer requests' : 'pending offers'} found
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
