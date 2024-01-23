import { Table, Pagination, Button } from "flowbite-react";
import React from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { getInquiriesUser, getInquiriesOfficeWorker } from "../../utils/api";
import { Loader } from "../../components/loader";
import { InquiryDetails } from "../../components/details/inquiry";
import { isPackageValid } from "../../components/details/inquiry";
import { FilterInquiriesModal } from "../../components/modals/inquiries/filterInquiriesModal";
import { getUserIdFromStorage, getUserInfo } from "../../utils/storage";

export default function Inquiries() {
  const [page, setPage] = React.useState(1);
  const [inputData, setInputData] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any>(null);
  const [role, setRole] = React.useState<any>(null);

  const [sortedColumn, setSortedColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('ascending');

  const [showFilterInquiriesModal, setShowFilterInquiriesModal] = React.useState(false);

  const [loadingHeader, setLoadingHeader] = React.useState(true);
  const [loadingInquiries, setLoadingInquiries] = React.useState(true);

  React.useEffect(() => {
    ((getUserInfo().role === "officeworker") ? getInquiriesOfficeWorker() : getInquiriesUser(getUserIdFromStorage()))
      .then((res) => {
        if (res.status === 200) {
          setInputData(res?.data);
          setTableData(res?.data);
          setRole(getUserInfo().role);
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        setInputData(null);
        setTableData(null);
      })
      .finally(() => {
        setLoadingInquiries(false);
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
        case 'packageDimensions': {
          const volumeA = a.width * a.height * a.depth;
          const volumeB = b.width * b.height * b.depth;
          return direction === 'ascending' ? volumeA - volumeB : volumeB - volumeA;
        }
        case 'packageWeight': {
          const weightA = a.weight;
          const weightB = b.weight;
          return direction === 'ascending' ? weightA - weightB : weightB - weightA;
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
        case 'dateOfInquiring': {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (direction === 'ascending') {
            return dateA > dateB ? 1 : -1;
          }
          else {
            return dateA < dateB ? 1 : -1;
          }
        }
        case 'status': {
          const statusA = isPackageValid(a.validTo) ? "valid" : "expired";
          const statusB = isPackageValid(b.validTo) ? "valid" : "expired";
          if (direction === 'ascending') {
            return statusA > statusB ? 1 : -1;
          }
          else {
            return statusA < statusB ? 1 : -1;
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
      {loadingHeader || loadingInquiries ? <Loader /> : null}
      <div className="container mx-auto px-4">
        <Header loading={loadingHeader} setLoading={setLoadingHeader} />
        <div style={tableHeaderStyle.row}>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white" style={tableHeaderStyle.left}>
            {role == "officeworker" ? 'Bank inquiries' : 'Your inquiries'}
          </h1>
          <Button className="mr-2" onClick={() => setShowFilterInquiriesModal(true)}>
            <span className="hidden sm:flex">Filter data</span>
          </Button>
        </div>
        <p className="mb-5">
          To see details of an inquiry or check its full status, click button in the last column of the table.
        </p>
        <FilterInquiriesModal
          show={showFilterInquiriesModal}
          setShow={setShowFilterInquiriesModal}
          inputData={inputData}
          tableData={tableData}
          setTableData={setTableData}
          role={role}
        />
        <Table>
          <Table.Head>
            <Table.HeadCell onClick={() => handleSort('id')}>
              Id {getSortIcon('id')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('packageDimensions')}>
              Package dimensions {getSortIcon('packageDimensions')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('packageWeight')}>
              Package weight {getSortIcon('packageWeight')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('sourceAddress')}>
              Source address {getSortIcon('sourceAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('destinationAddress')}>
              Destination address {getSortIcon('destinationAddress')}
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('dateOfInquiring')}>
              Date of inquiring {getSortIcon('dateOfInquiring')}
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
              tableData?.map((inquiry: any) => (
                <InquiryDetails
                  key={inquiry.id}
                  inquiryData={inquiry}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No inquiries found
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
