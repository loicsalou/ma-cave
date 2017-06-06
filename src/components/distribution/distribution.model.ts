/**
 * Created by loicsalou on 06.06.17.
 */
interface Distribution {
  axis: string;
  values: KeyValue[];
}

interface KeyValue {
  key: string;
  value: number;
}
