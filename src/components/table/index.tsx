import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import styled from "styled-components";
import { Colors } from "../../config/theme";
import Select, { StylesConfig } from "react-select";
import { TickIcon, CloseIcon } from "../icons";
import { mobile } from "../../config/screens";

const ProductData = require("../../data/product.json");

type OptionType = {
  value: string;
  label: string;
};

const TableContent = styled.div`
  height: 73%;
  width: 100%;
  overflow-x: scroll;
`;

const TableContainer = styled.table`
  border-collapse: collapse;
  border: 1px solid #ddd;
  padding: 8px;
  width: 100%;
`;

const TableHead = styled.thead``;

const TR = styled.tr``;

const TH = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background: ${Colors.lightblue};
  color: ${Colors.white};
`;

const TD = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  background: ${Colors.lightblue};
  color: ${Colors.white};
  text-align: center;
`;

const FTD = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  background: ${Colors.darkblue};
  color: ${Colors.white};
  text-align: center;
`;

const TableBody = styled.tbody``;

const Input = styled.input`
  transition: all 100ms;
  background-color: hsl(0, 0%, 100%);
  border-color: hsl(0, 0%, 80%);
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  min-height: 38px;
  outline: 0 !important;
  width: 60px;
`;

const ActionButtons = styled.div`
  position: absolute;
  background: ${Colors.red};
  padding: 0px;
  left: 0;
  right: 0;
  top: 50px;
  text-align: center;
  display: flex;
  justify-content: space-around;
`;

const ButtonContainer = styled.div`
  cursor: pointer;
  margin-top: 5px;
`;

const Footer = styled.div`
  background: ${Colors.darkblue};
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: ${Colors.white};

  ${mobile(`
        flex-direction: column;
  `)}
`;

const dropdownStyles: StylesConfig<any, false> = {
  container: (provided) => ({
    ...provided,
    flexGrow: 1,
  }),
  control: (provided) => ({
    ...provided,
    background: "#fff",
    borderColor: "#9e9e9e",
    minHeight: "24px",
  }),
  option: (provided, state) => ({
    ...provided,
    color: Colors.lightblue,
    backgroundColor: state.isSelected ? Colors.darkblue : "inherit",
    "&:hover": {
      backgroundColor: state.isSelected ? "#192E49" : "rgb(222, 235, 255)",
    },
  }),
};

type Variants = {
  name: string;
  price: number;
};

type Product = {
  name: string;
  variants: Variants[];
};

type AddProduct = {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  total: number;
};

function convertNumberToInr(value: number) {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}

const Table = ({
  showAddButton,
  setShowAddButton,
}: {
  showAddButton: boolean;
  setShowAddButton?: (value: boolean) => void;
}) => {
  const [product, setProduct] = useState<Product[]>([]);
  const [selectProduct, setSelectProduct] = useState<string | null>();
  const [selectVariants, setSelectVariants] = useState<Variants | null>();
  const [quantity, setQuantity] = useState<number | null>();
  const [billingProduct, addBillingProduct] = useState<AddProduct[]>([]);
  const selectVariantsRef = useRef(null);
  const selectProductRef = useRef(null);

  useEffect(() => {
    if (ProductData?.groceryItems) {
      setProduct(ProductData?.groceryItems);
    }
  }, [ProductData]);

  const getProductOptions = useMemo(() => {
    return product.map((item) => {
      return {
        value: item.name,
        label: item.name,
        ...item,
      };
    });
  }, [product]);

  const getProductVariants = useMemo(() => {
    if (selectProduct) {
      const getSelectProduct = product.find(
        (item) => item.name == selectProduct
      );
      if (getSelectProduct) {
        return getSelectProduct.variants.map((item) => {
          return {
            value: item.name,
            label: item.name,
            ...item,
          };
        });
      }
      return [];
    }
  }, [product, selectProduct]);

  const totalAmount = useMemo(() => {
    return billingProduct.reduce((n, { total }) => n + total, 0);
  }, [billingProduct]);

  const getTotal = useMemo(() => {
    if (quantity && selectVariants?.price) {
      return convertNumberToInr(selectVariants?.price * quantity);
    }
    return null;
  }, [selectVariants?.price, quantity]);

  const handleAddProduct = useCallback(() => {
    if (
      selectProduct &&
      selectVariants?.name &&
      selectVariants.price &&
      quantity
    ) {
      const product = {
        id: Date.now(),
        name: selectProduct,
        variant: selectVariants?.name,
        quantity: quantity,
        price: selectVariants?.price,
        total: selectVariants?.price * quantity,
      };
      addBillingProduct([...billingProduct, product]);
      setQuantity(null);
      if (selectVariantsRef.current && selectProductRef.current) {
        const clearVariantValue = selectVariantsRef.current as {
          clearValue: () => {};
        };
        const clearProductValue = selectProductRef.current as {
          clearValue: () => {};
        };
        clearVariantValue.clearValue();
        clearProductValue.clearValue();
      }
      if (setShowAddButton) setShowAddButton(true);
    }
  }, [selectProduct, selectVariants?.name, selectVariants?.price, quantity]);

  const handleCancel = useCallback(() => {
    if (setShowAddButton) setShowAddButton(true);
  }, []);

  const handleDownload = useCallback(() => {
    const data = {
      product: billingProduct,
      total: {
        tax: "18%",
        totalAmount: convertNumberToInr(totalAmount + totalAmount * 0.18),
      },
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data" + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, []);

  return (
    <>
      <TableContent>
        <TableContainer>
          <TableHead>
            <TR>
              <TH style={{ width: "5%" }}>#</TH>
              <TH style={{ width: "20%" }}>Product</TH>
              <TH style={{ width: "20%" }}>Variant</TH>
              <TH style={{ width: "2%" }}>Quantity</TH>
              <TH style={{ width: "5%" }}>Price</TH>
              <TH style={{ width: "15%" }}>Total</TH>
            </TR>
          </TableHead>
          <TableBody>
            {billingProduct.map((item, index) => (
              <TR key={index}>
                <TD>{index + 1}</TD>
                <TD>{item.name}</TD>
                <TD>{item.variant}</TD>
                <TD>{item.quantity}</TD>
                <TD>{item.price}</TD>
                <TD>{convertNumberToInr(item.total)}</TD>
              </TR>
            ))}
            {!showAddButton && (
              <TR>
                <FTD>{billingProduct.length + 1}</FTD>
                <FTD>
                  <Select
                    ref={selectProductRef}
                    options={getProductOptions}
                    styles={dropdownStyles}
                    onChange={(e) => {
                      setSelectProduct(e?.value);
                      setSelectVariants(null);
                      if (selectVariantsRef.current) {
                        const clearValue = selectVariantsRef.current as {
                          clearValue: () => {};
                        };
                        clearValue.clearValue();
                      }
                    }}
                  />
                </FTD>
                <FTD>
                  <Select
                    options={getProductVariants}
                    onChange={(e) => {
                      if (e) {
                        setSelectVariants({
                          name: e.name,
                          price: e.price,
                        });
                      }
                    }}
                    ref={selectVariantsRef}
                    styles={dropdownStyles}
                  />
                </FTD>
                <FTD>
                  <Input
                    type="number"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </FTD>
                <FTD>{selectVariants?.price}</FTD>
                <FTD style={{ position: "relative" }}>
                  {getTotal}
                  <ActionButtons>
                    <ButtonContainer onClick={handleAddProduct}>
                      <TickIcon size={"30"} color={"#ffff"} />
                    </ButtonContainer>
                    <ButtonContainer onClick={handleCancel}>
                      <CloseIcon size={"30"} color={"#ffff"} />
                    </ButtonContainer>
                  </ActionButtons>
                </FTD>
              </TR>
            )}
          </TableBody>
        </TableContainer>
      </TableContent>
      {billingProduct.length > 0 && (
        <Footer>
          <div style={{ cursor: "pointer" }} onClick={handleDownload}>
            <b>Download JSON</b>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <b>Total : </b>
              {convertNumberToInr(totalAmount)}
            </div>
            <div>
              {" "}
              <b> &nbsp; + GST 18% : </b>
              {convertNumberToInr(totalAmount * 0.18)} &nbsp;
            </div>
            <div> = {convertNumberToInr(totalAmount + totalAmount * 0.18)}</div>
          </div>
        </Footer>
      )}
    </>
  );
};

export default Table;
