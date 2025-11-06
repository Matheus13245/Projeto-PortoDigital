import * as React from "react";
import { View } from "react-native";
import { Controller, Control } from "react-hook-form";
import { TextInput, HelperText } from "react-native-paper";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function FormTextInput({
  control,
  name,
  label,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
}: Props) {
  const [visible, setVisible] = React.useState(!secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={{ width: "80%", marginTop: 12 }}>
          <TextInput
            mode="outlined"
            label={label}
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry ? !visible : false}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            right={
              secureTextEntry ? (
                <TextInput.Icon
                  icon={visible ? "eye-off" : "eye"}
                  onPress={() => setVisible((v) => !v)}
                />
              ) : undefined
            }
            error={!!error}
          />
          <HelperText type="error" visible={!!error}>
            {error?.message}
          </HelperText>
        </View>
      )}
    />
  );
}

