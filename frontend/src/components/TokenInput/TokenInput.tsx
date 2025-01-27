import styled from "@emotion/styled";
import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import BN from "@src/utils/BN";
import _ from "lodash";
import Text from "@components/Text";
import { TOKENS_BY_ASSET_ID } from "@src/constants";
import SizedBox from "@components/SizedBox";
import { FormattedInput } from "./FormattedInput";

interface IProps {
  assetId: string;
  setAssetId?: (assetId: string) => void;

  decimals: number;
  description?: string;

  amount: BN;
  setAmount?: (amount: BN) => void;

  error?: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;

  & > :first-of-type {
    margin-bottom: 8px;
  }
`;

const InputContainer = styled.div<{
  focused?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  error?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  height: 32px;
  width: 100%;
  position: relative;
  cursor: ${({ readOnly }) => (readOnly ? "not-allowed" : "unset")};

  box-sizing: border-box;

  input {
    cursor: ${({ readOnly }) => (readOnly ? "not-allowed" : "unset")};
  }

  background: #323846;
  border: 1px solid
    ${({ error, focused }) =>
      error ? "#FF6A55" : focused ? "#3C69FF" : "#3a4050"};
  border-radius: 4px;
`;
const TokenInput: React.FC<IProps> = (props) => {
  const [focused, setFocused] = useState(false);
  const [amount, setAmount] = useState<BN>(props.amount);

  useEffect(() => {
    props.amount && setAmount(props.amount);
  }, [props.amount]);

  const handleChangeAmount = (e: any) => {
    const value = BN.parseUnits(e.target.value, props.decimals);
    setAmount(value);
    debounce(value);
  };
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((value: BN) => {
      props.setAmount && props.setAmount(value);
    }, 500),
    []
  );

  return (
    <Root>
      <InputContainer
        focused={focused}
        readOnly={!props.setAmount}
        error={props.error}
      >
        {props.description != null && (
          <Text
            style={{ whiteSpace: "nowrap" }}
            type="secondary"
            size="small"
            fitContent
          >
            {props.description}
          </Text>
        )}
        <FormattedInput
          placeholder="0.00"
          decimals={props.decimals}
          formatSeparator=","
          value={BN.formatUnits(amount, props.decimals).toString()}
          onChange={handleChangeAmount}
          autoFocus={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          readOnly={!props.setAmount}
        />
        <SizedBox width={4} />
        <Text
          style={{ whiteSpace: "nowrap" }}
          type="secondary"
          size="small"
          fitContent
        >
          {TOKENS_BY_ASSET_ID[props.assetId].symbol}
        </Text>
      </InputContainer>
    </Root>
  );
};
export default observer(TokenInput);
