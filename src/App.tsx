import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

import {
  Card,
  CardMedia,
  Container,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  InputAdornment,
  Link,
  TextareaAutosize,
  TextField
} from "@mui/material";

const BUCKET_NAME = "kmn-cdn";

export default function App() {
  const [state, setState] = useState({ cdnRoute: "", payload: "" });
  const pathInputRef = useRef<HTMLInputElement>(null);
  const widthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);

  const getCdnRoute = (
    bucket: string = "",
    key: string = "",
    width?: string,
    height?: string
  ) => {
    const payload = {
      bucket,
      key,
      edits: {}
    };

    if (width && height) {
      payload.edits = { resize: { width, height } };
    }

    console.log({ payload, pathInputRef });

    const payloadStr = JSON.stringify(payload);

    const cdnRoute =
      "https://cdn.roms-gw.com/" + Buffer.from(payloadStr).toString("base64");

    return { cdnRoute, payload: payloadStr };
  };

  const updateCdnRoute = () => {
    const result = getCdnRoute(
      BUCKET_NAME,
      pathInputRef.current?.value,
      widthInputRef.current?.value,
      heightInputRef.current?.value
    );
    setState((PS) => ({ ...PS, ...result }));
    console.log(result);
  };

  useEffect(() => {
    updateCdnRoute();
  }, []);

  return (
    <Container className="App">
      <h1>AWS Signature creator</h1>
      <h2>Start editing to see some magic happen!</h2>
      <FormGroup className="mb-3">
        <TextField
          margin="normal"
          required
          fullWidth
          label="Bucket path"
          inputRef={pathInputRef}
          onChange={() => updateCdnRoute()}
        />
        <TextField
          inputRef={widthInputRef}
          label="width"
          sx={{ m: 1, width: "25ch" }}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>
          }}
          onChange={() => updateCdnRoute()}
        />

        <TextField
          inputRef={heightInputRef}
          label="height"
          type="number"
          sx={{ m: 1, width: "25ch" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>
          }}
          onChange={() => updateCdnRoute()}
        />
        <FormLabel className="text-muted" style={{ marginTop: 20 }}>
          Payload
        </FormLabel>

        <TextareaAutosize readOnly value={state.payload} />

        <FormLabel className="text-muted" style={{ marginTop: 20 }}>
          {state.cdnRoute ? `Your url:` : ""}
        </FormLabel>

        <Link href={state.cdnRoute} target="_blank">
          {state.cdnRoute}
        </Link>

        <CardMedia component="img" src={state.cdnRoute} />
      </FormGroup>
    </Container>
  );
}
